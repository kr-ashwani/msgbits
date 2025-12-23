import { toast } from "@/utils/toast/Toast";
import { CallManager } from "./CallManager";

// Decorator types
type MethodDecorator = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor;

// Validation decorators
function requiresNoCallSession(
  errorMessage: string = "Call session already exists",
): MethodDecorator {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function (this: CallManager, ...args: any[]) {
      if (this.getSession()) {
        toast.error(errorMessage);
        return;
      }
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}

function requiresCallSession(
  errorMessage: string = "No active call session",
): MethodDecorator {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function (this: CallManager, ...args: any[]) {
      if (!this.getSession()) {
        toast.error(errorMessage);
        return;
      }
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}

// Method decorator factory that accepts custom error message
function handleError(errorMessage?: string): MethodDecorator {
  return function (
    _target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: any, ...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        const devDetails =
          error instanceof Error && process.env.NODE_ENV === "development"
            ? ` because ${error.message}`
            : "";

        const fullMessage = errorMessage
          ? `${errorMessage}${devDetails}`
          : `Error in ${propertyKey}${devDetails}`;

        toast.error(fullMessage);

        // Re-throw in development for debugging
        if (process.env.NODE_ENV === "development") {
          console.error(`Error in ${propertyKey}:`, error);
        }

        // Return undefined or false to indicate failure
        return undefined;
      }
    };

    return descriptor;
  };
}

export { requiresCallSession, requiresNoCallSession, handleError };
