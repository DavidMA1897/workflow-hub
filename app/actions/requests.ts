"use server";

import { RequestStatus } from "@/generated/prisma/client";
import { requireAuthenticatedUser } from "@/lib/auth/authorization";
import { RequestAccessError, requireDraftOwnership } from "@/lib/requests/access";
import { prisma } from "@/lib/prisma";
import { transitionRequest, WorkflowError } from "@/lib/requests/workflow";
import {
  requestFormSchema,
  requestIdSchema,
  transitionSchema,
} from "@/validations/request";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type RequestActionState = {
  errors?: { title?: string[]; description?: string[]; comment?: string[] };
  message?: string;
};

function requestFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description") ?? "",
  };
}

function revalidateRequestViews(requestId: string) {
  revalidatePath("/requests");
  revalidatePath(`/requests/${requestId}`);
  revalidatePath("/dashboard");
  revalidatePath("/activity");
}

export async function createRequest(
  _previousState: RequestActionState,
  formData: FormData,
): Promise<RequestActionState> {
  const user = await requireAuthenticatedUser();
  const result = requestFormSchema.safeParse(requestFormData(formData));
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  let requestId: string;
  try {
    requestId = await prisma.$transaction(async (transaction) => {
      const request = await transaction.request.create({
        data: {
          title: result.data.title,
          description: result.data.description || null,
          status: RequestStatus.DRAFT,
          createdById: user.id,
        },
        select: { id: true },
      });
      await transaction.requestHistory.create({
        data: {
          requestId: request.id,
          userId: user.id,
          fromStatus: null,
          toStatus: RequestStatus.DRAFT,
        },
      });
      return request.id;
    });
  } catch {
    return { message: "We could not create the request. Please try again." };
  }

  revalidateRequestViews(requestId);
  redirect(`/requests/${requestId}`);
}

export async function updateRequest(
  _previousState: RequestActionState,
  formData: FormData,
): Promise<RequestActionState> {
  const user = await requireAuthenticatedUser();
  const idResult = requestIdSchema.safeParse(formData.get("requestId"));
  const result = requestFormSchema.safeParse(requestFormData(formData));
  if (!idResult.success) return { message: "This request is not available." };
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const request = await prisma.request.findUnique({
    where: { id: idResult.data },
    select: { createdById: true, status: true },
  });
  if (!request) return { message: "This request is not available." };

  try {
    requireDraftOwnership(user, request);
  } catch (error) {
    if (error instanceof RequestAccessError) return { message: error.message };
    throw error;
  }

  const updated = await prisma.request.updateMany({
    where: {
      id: idResult.data,
      createdById: user.id,
      status: RequestStatus.DRAFT,
    },
    data: {
      title: result.data.title,
      description: result.data.description || null,
    },
  });
  if (updated.count !== 1) {
    return { message: "This request can no longer be edited. Refresh and try again." };
  }

  revalidateRequestViews(idResult.data);
  redirect(`/requests/${idResult.data}`);
}

export async function changeRequestStatus(
  _previousState: RequestActionState,
  formData: FormData,
): Promise<RequestActionState> {
  const user = await requireAuthenticatedUser();
  const result = transitionSchema.safeParse({
    requestId: formData.get("requestId"),
    action: formData.get("action"),
    comment: formData.get("comment") ?? "",
  });
  if (!result.success) {
    return {
      errors: { comment: result.error.flatten().fieldErrors.comment },
      message:
        result.error.flatten().fieldErrors.requestId ||
        result.error.flatten().fieldErrors.action
          ? "Invalid workflow action."
          : undefined,
    };
  }

  try {
    await transitionRequest({
      requestId: result.data.requestId,
      action: result.data.action,
      comment: result.data.comment,
      user,
    });
  } catch (error) {
    if (error instanceof WorkflowError) return { message: error.message };
    return { message: "We could not update the workflow. Please try again." };
  }

  revalidateRequestViews(result.data.requestId);
  redirect(`/requests/${result.data.requestId}`);
}
