import { format } from "date-fns";
import { ExternalToast, ToastT, toast as toastDelegate } from "sonner";

/* ----------------------------------------
   Type helpers (version-safe)
---------------------------------------- */

type ToastPromiseId<T> = ReturnType<typeof toastDelegate.promise<T>>;

/* ----------------------------------------
   Namespace typing
---------------------------------------- */

declare namespace toastFn {
  export var success: (
    message: string | React.ReactNode,
    data?: ExternalToast,
  ) => string | number;

  export var info: (
    message: string | React.ReactNode,
    data?: ExternalToast,
  ) => string | number;

  export var warning: (
    message: string | React.ReactNode,
    data?: ExternalToast,
  ) => string | number;

  export var error: (
    message: string | React.ReactNode,
    data?: ExternalToast,
  ) => string | number;

  export var custom: (
    jsx: (id: number | string) => React.ReactElement,
    data?: ExternalToast,
  ) => string | number;

  export var message: (
    message: string | React.ReactNode,
    data?: ExternalToast,
  ) => string | number;

  // ✅ FIXED (no ToastId import)
  export var promise: <ToastData>(
    promise: PromiseT<ToastData>,
    data?: PromiseData<ToastData>,
  ) => ToastPromiseId<ToastData>;

  export var dismiss: (id?: number | string) => string | number;

  export var loading: (
    message: string | React.ReactNode,
    data?: ExternalToast,
  ) => string | number;

  export var getHistory: () => (ToastT | ToastToDismiss)[];
}

/* ----------------------------------------
   Base toast function
---------------------------------------- */

function toastFn(
  message: string | React.ReactNode,
  data?: ExternalToast,
): string | number {
  return toastDelegate(message, {
    description: format(new Date(), "EEEE, MMMM dd, yyyy 'at' h:mm a"),
    ...data,
  });
}

/* ----------------------------------------
   Typed helpers
---------------------------------------- */

function toastFnWithType(
  type: "success" | "info" | "error" | "warning" | "message" | "loading",
) {
  return (
    message: string | React.ReactNode,
    data?: ExternalToast,
  ): string | number => {
    return toastDelegate[type](message, {
      description: format(new Date(), "EEEE, MMMM dd, yyyy 'at' h:mm a"),
      ...data,
    });
  };
}

/* ----------------------------------------
   Attach helpers
---------------------------------------- */

const toast = toastFn as typeof toastFn & typeof toastFn;

toast.success = toastFnWithType("success");
toast.info = toastFnWithType("info");
toast.error = toastFnWithType("error");
toast.warning = toastFnWithType("warning");
toast.message = toastFnWithType("message");
toast.loading = toastFnWithType("loading");

toast.dismiss = (id?: number | string): string | number => {
  return toastDelegate.dismiss(id);
};

toast.getHistory = (): (ToastT | ToastToDismiss)[] => {
  return toastDelegate.getHistory();
};

toast.promise = <ToastData>(
  promise: PromiseT<ToastData>,
  data?: PromiseData<ToastData>,
): ToastPromiseId<ToastData> => {
  return toastDelegate.promise(promise, {
    description: format(new Date(), "EEEE, MMMM dd, yyyy 'at' h:mm a"),
    ...data,
  });
};

export { toast };
