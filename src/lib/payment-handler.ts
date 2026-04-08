// src/lib/payment-handler.ts
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { PaymentInitiateResponse } from "@/types/payment";

export const executePaymentFlow = (
  rawResponse: any, 
  orderId: string, 
  router: AppRouterInstance
) => {
  if (!rawResponse) {
    toast.error("Invalid payment response from server");
    return;
  }

  // 🔥 THE ADAPTER: Automatically shape the raw backend payload into our strict contract
  let res: PaymentInitiateResponse = rawResponse;

  if (rawResponse.provider === "PAYU" && rawResponse.formPayload) {
    res = {
      provider: "PAYU",
      flow: "FORM",
      url: rawResponse.formPayload.actionUrl,
      params: { ...rawResponse.formPayload }
    };
    if (res.params) {
      delete res.params.actionUrl; // Don't send the URL as a hidden input
    }
  }

  // 🔥 THE EXECUTOR: Route based on the flow instruction
  switch (res.flow) {
    case "REDIRECT":
      if (!res.url) throw new Error("Redirect URL missing from provider");
      toast.loading(`Redirecting to ${res.provider}...`);
      window.location.href = res.url;
      break;

    case "FORM":
      if (!res.url || !res.params) throw new Error("Form configuration missing");
      toast.loading(`Connecting to secure payment gateway...`);
      
      const form = document.createElement("form");
      form.method = res.method || "POST";
      form.action = res.url;
      form.target = "_self";

      Object.entries(res.params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          const hiddenField = document.createElement("input");
          hiddenField.type = "hidden";
          hiddenField.name = key;
          hiddenField.value = String(value);
          form.appendChild(hiddenField);
        }
      });

      document.body.appendChild(form);
      setTimeout(() => form.submit(), 100);
      break;

    case "NONE":
      toast.success("Order placed successfully!");
      router.push(`/order-success/${orderId}`);
      break;

    default:
      // Fallback if the backend sends an older/unknown structure
      if (res.url || rawResponse.checkoutUrl) {
         window.location.href = res.url || rawResponse.checkoutUrl;
      } else {
         console.error("Unknown payment flow:", res);
         toast.error("Payment routing failed. Please contact support.");
      }
  }
};