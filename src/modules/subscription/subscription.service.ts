import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe";
import { SubscriptionStatus } from "../../../generated/prisma/enums";
import { handleChangeSubscription, handleCheckoutCompleted } from "./subscription.utils";

const createCheckoutSession=async(userId:string)=>{
     const user=await prisma.user.findUniqueOrThrow({
        where:{
            id:userId
        },
        include:{
            subscription:true
        }
     })

     //old subscriber
     let stripeCustomerId=user.subscription?.stripeCustomerId;

     if(!stripeCustomerId){
        //new subscriber
        const customer=await stripe.customers.create({
            email:user.email,
            name:user.name,
            metadata:{userId:user.id}
        })
        stripeCustomerId=customer.id
     }

     const session=await stripe.checkout.sessions.create({
        line_items:[{
            price:config.stripe_product_price_ID,
            quantity:1
        }],
        mode:"subscription",
        customer:stripeCustomerId,
        allowed_payment_method_types:["card"],
        success_url:`${config.app_url}/premium?success=true`,
        cancel_url:`${config.app_url}/payment?success=false`,
        metadata:{userId:user.id},
        subscription_data:{
            metadata:{userId:user.id}
        }
     })

   return {
    paymentUrl:session.url
   }
}

const handleWebhook=async(payload:Buffer,signature:string)=>{
   const endpointSecret=config.stripe_webhook_secret;

   console.log("WEBHOOK SERVICE HIT");
   const event=stripe.webhooks.constructEvent(payload,signature,endpointSecret);
   console.log("STRIPE EVENT TYPE:", event.type);

   switch (event.type) {
    case 'checkout.session.completed':
    //Occurs when a checkout session has been successfully completed.
      await handleCheckoutCompleted(event.data.object);
      break;

    case 'customer.subscription.updated':
    // Occurs whenever a subscription changes (e.g., switching from one plan to another or changing the status from trial to active)
    // To test this run: stripe subscriptions cancel your_subscriptionId
      await handleChangeSubscription(event.data.object);
      break;
    case 'customer.subscription.deleted':
    // Occurs whenever a customer's subscription ends
      await handleChangeSubscription(event.data.object);
      break;
    default:
      // Unexpected event type
      console.log(`No events matched. Unhandled event type ${event.type}.`);
      break;
  }
}

const getSubscriptionStatus=async(userId:string)=>{
    const isSubscriptionExist=await prisma.subscription.findUniqueOrThrow({
        where:{
            userId
        }
    });

    const isActive=isSubscriptionExist.status==="ACTIVE" && isSubscriptionExist.currentPeriodEnd && new Date(isSubscriptionExist.currentPeriodEnd)>new Date();

    return{
        status:isSubscriptionExist.status,
        isSubscribed:isActive,
        currentPeriodEnd:isSubscriptionExist.currentPeriodEnd
    }
}

export const subscriptionServices={
    createCheckoutSession,
    handleWebhook,
    getSubscriptionStatus
}
