👋 Welcome to Hyperswitch API Reference

Copy page

Hyperswitch provides a collection of APIs that enable you to process and manage payments. Our APIs accept and return JSON in the HTTP body and return standard HTTP response codes. You can consume the APIs directly using your favorite HTTP/REST library.
Try a Payment
Create your first payment using Hyperswitch APIs.
Payment Flows
Discover how to process one-time and recurring payments, save payment methods, and more.
Save a payment method
Save customer payment methods securely for future transactions
Self Hosted?
Host Hyperswitch on-premise? Utilize our full API suite.
​
Environment
We have a testing environment referred to “sandbox,” which you can set up to test API calls without affecting production data. You can sign up on our Dashboard to get API keys to access Hyperswitch API.
Use the following base URLs when making requests to the APIs:
Environment	Base URL
Sandbox	https://sandbox.hyperswitch.io
Production	https://api.hyperswitch.io
If you do not hold a PCI certification to collect and store card data on your servers, we recommend using Unified Checkout to accept card information from users.
​
Authentication and API keys
Hyperswitch authenticates your API requests using your account’s API keys. Each account has two API keys for authentication:
Key	Example	When to Use
Secret key (API-key)	snd_c69***	Used to authenticate API requests from your merchant server. Don’t expose this key on a website or embed it in a mobile application.
Publishable key	pk_snd_3b3***	Used to authenticate API requests from your app’s client. Can be publicly-accessible in your web or mobile app’s client-side code.
Get your API key and Publishable Key
Postman Collection
​
Payment Status Lifecycle
Hyperswitch handles the complex functionality of a comprehensive payments flow through the Payments object that transitions through multiple states during its payments lifecycle. Given below are the various statuses a payment can have:
Payment Status	Description
requires_payment_method	Once you create a payment through payments/create endpoint with no payment method attached to it, the payments object transitions to ‘requires_payment_method’.
requires_confirmation	After attaching a payment method through payments/update endpoint, the payments object requires you to confirm the payment.
requires_customer_action	Once the payment is confirmed through payments/confirm endpoint, if additional authentication is required, the payments object transitions to this state.
requires_capture	If you want to do separate authorize and capture, setting capture field to ‘manual’ during payments/create or confirm call will transition the payment object to this state after customer action succeeds.
processing	In case of automatic capture, the payments object transitions to processing state post confirm call and subsequent customer authentication if available.
succeeded	The payments object reaches success state post confirmation of successful processing from the payment processor.
failed	The payments object transitions to a failed state when the payment processor confirms the processing failure.
expired	You can expire the payments object while it is in any state except when it is under ‘processing’ or ‘succeeded’ state.


​
Redirect URL
This is what a url looks like after redirection
https://app.hyperswitch.io?status=succeeded&payment_intent_client_secret=pay_NCv9vc19f8aa75OpFxH8_secret_V4zAc7V0C8WAw6FECMKM&amount=10000&manual_retry_allowed=false&signature=4fae0cfa775e4551db9356563d4b98b55662fe3c1c945fe215d90ccf3541282c535909ae901d82174d6b1e46ba1684aa0aa4c8861be0e2a9ef6f950a975d5014&signature_algorithm=HMAC-SHA512
The available parameters are as follows:
status - can have values of succeeded, processingand failed.
payment_intent_client_secret - This is the client secret associated with the payment. This can be used to retrieve the payment status from hyperswitch.
manual_retry_allowed - whether this payment can be retried or not.
signature - A HMAC signature of the payload, this can be verified using the payment_response_hash_key.
signature_algorithm - The HMAC algorithm used to calculate the signature.
Was this page helpful?


Yes

No
Suggest edits
Raise issue
Authentication Types
Ask a question...

github
linkedin
Powered by Mintlify





Authentication Types

Copy page

Overview of authentication types and authorization keys available in Hyperswitch.

Hyperswitch supports multiple API key types, each designed for different authentication and authorization use cases.
For security, never expose secret or admin keys in client-side or mobile code. Use publishable keys for public contexts.
​
1. API Key (Secret Key)
Primary merchant authentication key for server-side API requests.
Environment-specific prefix (snd_, prod_, etc.).
Used for server to server requests.
This key can be generated and managed from the Hyperswitch dashboard (sandbox).
Never expose this key in public code.
​
2. Admin API Key
Administrative key with elevated privileges.
Used for system-level operations such as creating merchant and connector accounts.
Should only be used in secure, internal workflows.
Some API calls require an admin API key. Do not confuse this with a regular API Key.
The admin API key is a configuration value that can be set at the time of deploying the Hyperswitch server.
Admin API keys for the hosted Hyperswitch environments (sandbox/production) are managed by Juspay and are not provided publicly.
You do not generate this key from the dashboard.
Instead, set your Admin API Key in your deployment configuration:
For Docker Compose:
Update the value in your docker_compose.toml file:

Copy
# docker_compose.toml
admin_api_key = "your_admin_key_here"
For Helm Chart deployments: Set the admin API key in your values.yaml file.

Copy
# values.yaml
adminApiKey: your_admin_key_here
Do not expose your admin API key publicly. Only trusted entities and trusted applications should have access to this value.
Check the Docker Compose example for extra clarity: See example in the Hyperswitch repository
​
3. Publishable Key
Client-side key with limited permissions.
Safe for use in public client-side (web or mobile) code.
Prefix: pk_{environment}_{uuid}.
Generated during merchant account creation.
​
4. Ephemeral Key
Temporary key for limited operations.
Used for single or short-lived access (e.g., accessing a specific customer object).
Validity is configurable (see [eph_key] validity in development.toml).
​
5. JWT Key
JWT Bearer Token used for API authentication and session management.
Required for certain JWT-protected endpoints and user authentication flows.
Format: Authorization: Bearer <jwt_token>
​
When to Use
JWT tokens are primarily used by the Hyperswitch Control Center front end to authenticate API requests. You generally do not need to manage or use JWTs unless:
You’re building a custom front end that replaces the Control Center, or
You’re a developer testing APIs directly (e.g., using Postman or running the server without the UI).
For most users interacting through the Control Center UI, JWTs are handled automatically and do not need to be generated or included manually.
Note:
JWTs are not provisioned via the Hyperswitch dashboard.
They are typically issued during an authentication flow, such as during login or session creation.

Copy
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Keep your JWT tokens secure. Do not expose them in client-side code unless specifically required for session management, and always use HTTPS when transmitting JWTs.
​
Reference Table
Get your API Key and Publishable Key from the Hyperswitch dashboard.
Was this page helpful?


Yes

No
Suggest edits
Raise issue
Introduction
Error Codes
Ask a question...

github
linkedin
Powered by Mintlify






# Error Codes

Hyperswitch uses error codes, types, and messages to communicate errors during API calls. There are two main types of error codes: Error Codes and Unified Error Codes.

1. **Error Codes** refer to the error code sent by the connector.
2. **Unified Error Codes** refer to the generic error code sent by the Hyperswitch server, based on the connector's error code. Hyperswitch groups the different error codes from connectors into more generic Unified Error Codes for structured relay of PSP errors, helping merchants derive patterns and determine the next steps for ongoing transactions.

There are four types of Error Codes and five types of Unified Error Codes.

**1. Error Codes:**
The section below contains all the error codes and their corresponding error messages.

| Error Code | Type                  | Description                                                  |
| ---------- | --------------------- | ------------------------------------------------------------ |
| IR         | Invalid Request Error | Error caused due to invalid fields and values in API request |
| CE         | Connector Error       | Errors originating from connector’s end                      |
| HE         | Hyperswitch Error     | Errors originating from Hyperswitch’s end                    |
| WE         | Webhook Error         | Errors related to Webhooks                                   |

| Error Codes | HTTP Status codes                     | Error Type              | Error message                                                                                                                                                                  | Error Handling                                                                                                                                                                          |
| ----------- | ------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IR\_00      | 501                                   | server\_not\_available  | This API is under development and will be made available soon                                                                                                                  | No action required. If you require this feature, please reach out to Hyperswitch support                                                                                                |
| IR\_01      | 401                                   | invalid\_request\_error | API key not provided or invalid API key used. Provide the API key in the Authorization header using api-key (e.g api-key: API\_KEY) or create a new API key from the dashboard | Provide the API key in the Authorization header using api-key (e.g api-key: API\_KEY) or create a new API key from the dashboard                                                        |
| IR\_02      | 404                                   | invalid\_request\_error | Unrecognized request URL                                                                                                                                                       | Please recheck and enter the correct request URL. Refer to our API documentation                                                                                                        |
| IR\_03      | 405                                   | invalid\_request\_error | The HTTP method is not applicable for this API                                                                                                                                 | Please recheck the HTTP method used in the request. Refer to our API documentation                                                                                                      |
| IR\_04      | 400                                   | invalid\_request\_error | Missing required param: “field\_name”                                                                                                                                          | Please pass the missing required parameter. Refer to our API documentation                                                                                                              |
| IR\_05      | 422                                   | invalid\_request\_error | “field\_name” contains invalid data. Expected format is “expected\_format”                                                                                                     | Please pass the data in the expected format. Refer to our API documentation                                                                                                             |
| IR\_06      | 400                                   | invalid\_request\_error | “message”                                                                                                                                                                      | Refer to our API documentation for required fields and format                                                                                                                           |
| IR\_07      | 400                                   | invalid\_request\_error | Invalid value provided: “field\_name”                                                                                                                                          | Provide a valid value for the required fields in the expected format. Refer to our API documentation                                                                                    |
| IR\_08      | 400                                   | invalid\_request\_error | Client secret was not provided                                                                                                                                                 | Provide the client secret received in payments/create API response                                                                                                                      |
| IR\_09      | 400                                   | invalid\_request\_error | The client\_secret provided does not match the client\_secret associated with the Payment                                                                                      | Provide the same client secret received in payments/create API response for the corresponding payment                                                                                   |
| IR\_10      | 400                                   | invalid\_request\_error | Customer has an existing mandate/subscription                                                                                                                                  | Cancel the active mandates/subscriptions for the customer before proceeding to delete the customer data                                                                                 |
| IR\_11      | 400                                   | invalid\_request\_error | Customer has already been redacted                                                                                                                                             | Customer has already been redacted. No action required                                                                                                                                  |
| IR\_12      | 400                                   | invalid\_request\_error | Reached the maximum refund attempts                                                                                                                                            | Maximum refund attempts reached for this payment. Please contact Hyperswitch support for attempting more refunds for the same payment                                                   |
| IR\_13      | 400                                   | invalid\_request\_error | Refund amount exceeds the payment amount                                                                                                                                       | Please verify and pass a refund amount equal to or less than the payment amount                                                                                                         |
| IR\_14      | 400                                   | invalid\_request\_error | This Payment could not be “current\_flow” because it has a “field\_name” of “current\_value”. The expected state is “states”                                                   | Please verify the status of the payment and make sure that you are performing an action that is allowed for the current status of the payment                                           |
| IR\_15      | 400                                   | invalid\_request\_error | Invalid Ephemeral Key for the customer                                                                                                                                         | Please pass the right Ephemeral key for the customer                                                                                                                                    |
| IR\_16      | 400                                   | invalid\_request\_error | “message”                                                                                                                                                                      | Typically used when information involving multiple fields or previously provided information doesn’t satisfy a condition. Refer to our API documentation for required fields and format |
| IR\_17      | 401                                   | invalid\_request\_error | Access forbidden, an invalid JWT token was used                                                                                                                                | Provide a valid JWT token to access the APIs                                                                                                                                            |
| IR\_18      | 401                                   | invalid\_request\_error | "message"                                                                                                                                                                      | The user is not authorised to update the customer, Contact Org. Admin for the appropriate access.                                                                                       |
| IR\_19      | 400                                   | invalid\_request\_error | "message"                                                                                                                                                                      | Please check and retry with correct details. Refer to our API documentation                                                                                                             |
| IR\_20      | 400                                   | invalid\_request\_error | "flow" not supported by the "connector"                                                                                                                                        | Requested flow is not supported for this Connector.                                                                                                                                     |
| IR\_21      | 400                                   | invalid\_request\_error | Missing required params                                                                                                                                                        | Please add the required params in the request. Refer to our API documentation                                                                                                           |
| IR\_22      | 403                                   | invalid\_request\_error | Access forbidden. Not authorized to access this "resource"                                                                                                                     | Contact Org. Admin for the appropriate access.                                                                                                                                          |
| IR\_23      | 400                                   | invalid\_request\_error | "message"                                                                                                                                                                      | Use a supported file provider. Refer to our API documentation                                                                                                                           |
| IR\_24      | 422                                   | processing\_error       | Invalid "wallet\_name" wallet token                                                                                                                                            | Share the correct wallet token.                                                                                                                                                         |
| IR\_25      | 400                                   | invalid\_request\_error | Cannot delete the default payment method                                                                                                                                       | Check if the Payment method is activated. Refer to Control centre to check this.                                                                                                        |
| IR\_26      | 400                                   | invalid\_request\_error | Invalid Cookie                                                                                                                                                                 | Recheck the site setting for the cookies.                                                                                                                                               |
| IR\_27      | 404                                   | invalid\_request\_error | Extended card info does not exist                                                                                                                                              | Recheck the card info shared in the request.                                                                                                                                            |
| IR\_28      | 400                                   | invalid\_request\_error | "message"                                                                                                                                                                      | Use a valid currency. Refer to our API documentation                                                                                                                                    |
| IR\_29      | 422                                   | invalid\_request\_error | "message"                                                                                                                                                                      | The data format is invalid for this request. Refer to our API documentation                                                                                                             |
| IR\_30      | 400                                   | invalid\_request\_error | Merchant connector account is configured with invalid config                                                                                                                   | Correct the config for merchant connector account                                                                                                                                       |
| IR\_31      | 400                                   | invalid\_request\_error | Card with the provided iin does not exist                                                                                                                                      | Check the IIN (Issuer Identification Number) and ensure it is correct.                                                                                                                  |
| IR\_32      | 400                                   | invalid\_request\_error | The provided card IIN length is invalid, please provide an iin with 6 or 8 digits                                                                                              | Provide a valid IIN with either 6 or 8 digits.                                                                                                                                          |
| IR\_33      | 400                                   | invalid\_request\_error | File not found / valid in the request                                                                                                                                          | Ensure the required file is included in the request and is valid. Refer to our API documentation                                                                                        |
| IR\_34      | 400                                   | invalid\_request\_error | Dispute id not found in the request                                                                                                                                            | Ensure that a valid dispute ID is included in the request.                                                                                                                              |
| IR\_35      | 400                                   | invalid\_request\_error | File purpose not found in the request or is invalid                                                                                                                            | Specify a valid file purpose in the request.                                                                                                                                            |
| IR\_36      | 400                                   | invalid\_request\_error | File content type not found / valid                                                                                                                                            | Ensure the file content type is specified and is valid.                                                                                                                                 |
| IR\_37      | 404                                   | invalid\_request\_error | "message"                                                                                                                                                                      | Check the request for the resource being accessed and ensure it exists.                                                                                                                 |
| IR\_38      | 400                                   | invalid\_request\_error | "message"                                                                                                                                                                      | Check for any duplicate entries in the request and correct them.                                                                                                                        |
| IR\_39      | 400                                   | invalid\_request\_error | required payment method is not configured or configured incorrectly for all configured connectors                                                                              | Verify that the required payment method is correctly configured for all connectors in use.                                                                                              |
| CE\_00      | Status codes shared by the connectors | connector\_error        | “message”                                                                                                                                                                      | The error code and message passed from the connectors. Refer to the respective connector’s documentation for more information on the error                                              |
| CE\_01      | 400                                   | processing\_error       | Payment failed during authorization with the connector. Retry payment                                                                                                          | Retry the payment again as payment failed at the connector during authorization                                                                                                         |
| CE\_02      | 400                                   | processing\_error       | Payment failed during authentication with the connector. Retry payment                                                                                                         | Retry the payment again as payment failed at the connector during authentication                                                                                                        |
| CE\_03      | 400                                   | processing\_error       | Capture attempt failed while processing with the connector                                                                                                                     | Capture failed for the payment at the connector. Please retry the payment                                                                                                               |
| CE\_04      | 400                                   | processing\_error       | The card data is invalid                                                                                                                                                       | Invalid card data passed. Please pass valid card data                                                                                                                                   |
| CE\_05      | 400                                   | processing\_error       | The card has expired                                                                                                                                                           | Card expired. Please pass valid card data                                                                                                                                               |
| CE\_06      | 400                                   | processing\_error       | Refund failed while processing with the connector. Retry refund                                                                                                                | Refund failed to process at the connector. Please retry refund                                                                                                                          |
| CE\_07      | 400                                   | processing\_error       | Verification failed while processing with the connector. Retry operation                                                                                                       | Retry the operation again as verification failed at the connector                                                                                                                       |
| CE\_08      | 400                                   | processing\_error       | Dispute operation failed while processing with connector. Retry operation                                                                                                      | Retry the operation again as dispute failed at the connector                                                                                                                            |
| CE\_09      | 400                                   | invalid\_request\_error | Payout validation failed                                                                                                                                                       | Retry the operation again with correct Payout details.                                                                                                                                  |
| HE\_00      | 422,500                               | server\_not\_available  | Resource not available right now, Please try again later.                                                                                                                      | Please Wait for a few moments and try again. If the error still persists, please reach out to Hyperswitch support                                                                       |
| HE\_01      | 400,422                               | duplicate\_request      | Requested operation(Customer, Payments, Merchants, Refunds etc.) for these identifier already exists.                                                                          | Please verify the Details(Customer, Payments, Merchants, Refunds, as applicable on the basis of request) and enter valid details.                                                       |
| HE\_02      | 404                                   | object\_not\_found      | Requested object(Customer, Payments, Merchants, Refunds etc.) does not exist in our records                                                                                    | Please verify the Details(Customer, Payments, Merchants, Refunds, as applicable on the basis of request) and enter valid details.                                                       |
| HE\_03      | 500                                   | validation\_error       | Validation Failed for the requested operation with the given details.                                                                                                          | Please verify the details again and enter valid details                                                                                                                                 |
| HE\_04      | 404                                   | object\_not\_found      | Requested object(Customer, Payments, Merchants, Refunds etc.) does not exist in our records                                                                                    | Please verify the Details(Customer, Payments, Merchants, Refunds, as applicable on the basis of request) and enter valid details.                                                       |
| HE\_05      | 500                                   | processing\_error       | Missing or invalid tenant details.                                                                                                                                             | Please verify the tenant Details and try again.                                                                                                                                         |
| WE\_01      | 400                                   | invalid\_request\_error | Failed to authenticate the webhook                                                                                                                                             | Please verify the authentication credentials and try again.                                                                                                                             |
| WE\_02      | 400                                   | invalid\_request\_error | Bad request received in webhook                                                                                                                                                | Check the request parameters and format, then try again.                                                                                                                                |
| WE\_03      | 500                                   | router\_error           | There was some issue processing the webhook                                                                                                                                    | Please try again later. If the issue persists, contact Hyperswitch support.                                                                                                             |
| WE\_04      | 404                                   | object\_not\_found      | Webhook resource not found                                                                                                                                                     | Ensure the webhook URL is correct and the resource exists.                                                                                                                              |
| WE\_05      | 400                                   | invalid\_request\_error | Unable to process the webhook body                                                                                                                                             | Ensure the webhook body is correctly formatted and try again.                                                                                                                           |
| WE\_06      | 400                                   | invalid\_request\_error | Merchant Secret set by merchant for webhook source verification is invalid                                                                                                     | Verify the Merchant Secret, then try again.                                                                                                                                             |

**2. Unified Error codes:**
The section below contains all the unified error codes and their corresponding error messages.

| Unified Error Code | Unified Error Categorisation | Unified Error message              |
| ------------------ | ---------------------------- | ---------------------------------- |
| UE\_1000           | Customer Error               | Issue with payment method details. |
| UE\_2000           | Connector Declines           | Issue with Configurations.         |
| UE\_3000           | Connector Error              | Technical issue with PSP.          |
| UE\_4000           | Integration Error            | Issue in the integration.          |
| UE\_9000           | Others                       | Something went wrong.              |






# Rate Limits

The Hyperswitch API has multiple checks in place to enhance its stability when faced with sudden surges of incoming traffic. Merchants who send numerous requests in rapid succession could encounter error responses indicated by the status code 429.

<Warning>
  The default rate limit for all Hyperswitch APIs is **80 requests per second**.
  Reach out to [biz@hyperswitch.io](mailto:biz@hyperswitch.io) if you have a requirement for higher limits.
</Warning>

## How to handle rate limits

Effectively handling rate limit 429 errors is crucial for maintaining a seamless user experience.

* Implement retry mechanisms with progressively increasing intervals to avoid overwhelming the system with repeated requests.
* To proactively manage these errors, monitoring tools can help track usage patterns and provide insights for adjusting rate limits as necessary.
* Ultimately, a well-orchestrated strategy for managing 429 errors not only prevents disruption but also fosters positive user engagement by transparently addressing limitations and promoting responsible API usage.

## Understanding API locking

If you see a 429 error with the following error message, it is due to API locking and not due to rate limiting:

```text
At this moment, access to this object is restricted due to ongoing utilization by another API request or an ongoing Hyperswitch process. Retry after some time if this error persists.
```

API locking is a robust feature that empowers us to proactively secure and optimize access to our APIs. Our API locks objects on some operations to prevent the disruption caused by concurrent workloads that could potentially lead to inconsistent outcomes.

This proactive measure not only ensures the continued integrity and performance of our APIs but also guarantees a high standard of security for our users. Once triggered, the API lock initiates a controlled pause in access, preventing any potential threats from compromising the system.






# Go-live Checklist

Refer to this checklist for a seamless transition as you prepare to go live with your integration.

<Warning>
  The connector configurations set up in the sandbox need to be replicated on the Hyperswitch production account.
</Warning>

### Signing of Hyperswitch services agreement

* [ ] Ensure that the Hyperswitch services agreement is signed and shared with the Hyperswitch team. In case you need any help, please drop an email to [biz@hyperswitch.io](mailto:biz@hyperswitch.io).

<Warning>
  The Hyperswitch team will share your production Hyperswitch credentials once the above process is completed.
</Warning>

### Connector Configurations

* [ ] Configure all the required connectors using production credentials on the Hyperswitch production dashboard and enable the required payment methods.
* [ ] Ensure that the payment methods are enabled on the connector (payment processor) dashboard.
* [ ] Enable raw card processing for each connector. Some connectors offer this as a dashboard toggle feature. Some processors might need you to share a PCI Attestation of Compliance over email to enable this. Drop an email to [biz@hyperswitch.io](mailto:biz@hyperswitch.io) if you need any support with PCI AOC.

### Secure your api-keys

* [ ] Make sure your secret key (api-key) is not exposed on the front-end (website/mobile app).
* [ ] Ensure that your workflow avoids the duplication or storage of your API keys in multiple locations.

### Set up Webhooks

* [ ] [Configure your webhook endpoint](https://juspay-78.mintlify.app/essentials/webhooks#configuring-webhooks) on our dashboard to receive notifications for different events.
* [ ] Update Hyperswitch's webhook endpoints on your connector's Dashboard. [Refer here](https://juspay-78.mintlify.app/essentials/webhooks#configuring-webhooks) for detailed instructions.
* [ ] Update the connector secret key in our dashboard for us to authenticate webhooks sent by your connector.

### Secure your Payments

* [ ] Make sure you decrypt and verify the signed payload sent along with the payment status in your return URL.
* [ ] Always verify the payment amount and payment status before fulfilling your customer's shopping cart/service request.

### Error Handling

* [ ] Make sure your API integration is set up to handle all the possible error scenarios (refer this [link](https://juspay-78.mintlify.app/essentials/error_codes)).
* [ ] Ensure your Unified Checkout (SDK) integration is set up to handle all the possible error scenarios (refer this [link](https://hyperswitch.io/docs/sdkIntegrations/unifiedCheckoutWeb/errorCodes)).
* [ ] Ensure that your integration can handle the entire payments lifecycle and test various scenarios using actual payment details.

### Customize and sanity check the payment experience

* [ ] Ensure the pay button is properly highlighted to the customer.
* [ ] Ensure a blended look and feel of the payment experience using the [styling APIs](https://hyperswitch.io/docs/sdkIntegrations/unifiedCheckoutWeb/customization) of Unified Checkout.





# null

The **Hyperswitch Payments API** enables businesses to **accept, process, and manage payments seamlessly**. It supports the entire **payment lifecycle**—from creation to capture, refunds, and disputes—allowing smooth integration of **various payment methods** into any application with minimal complexity.

### How to try your first payment through hyperswitch?

You have two options to use the Payments API:

1. **Sandbox API Key (Dashboard)** – Quick testing without setup.
2. **Self-Deploy** – Create merchants and API keys through Rest API.

Each option has specific nuances, we have mentioned the differences in the below step by step guide
<Tip>We recommend using our [Dashboard](https://app.hyperswitch.io/dashboard/login) to generate API Key and setting up Connectors (Step 4) for faster trial and simple setup.</Tip>

<Steps>
  <Step title="Create a Merchant Account">
    This account is representative of you or your organization that would like to accept payments from different <Tooltip tip="Can be a payment method or payment service provider">payment connectors</Tooltip>

    <Steps>
      <Step title="Hyperswitch Dashboard flow" icon="box-open">
        Access the <Tooltip tip="Control Center is a frontend interface for the API to track and test payments">[Dashboard](https://app.hyperswitch.io/dashboard/login)</Tooltip> and sign up -> **Sign up here is equivalent to creating a Merchant Account**
      </Step>

      <Step title="Self-Deploy flow" icon="map-pin">
        Use the admin api key and the [Merchant Account - Create](api-reference/merchant-account/merchant-account--create) endpoint to create your Merchant Account
      </Step>
    </Steps>
  </Step>

  <Step title="Create API Key">
    You can now generate an API key that will be the secret key used to authenticate your payment request

    <Steps>
      <Step title="Hyperswitch Dashboard flow" icon="box-open">
        In Dashboard go to Developer-> API Keys -> +Create New Api Key. This key can be used in your API requests for authentication.
      </Step>

      <Step title="Self-Deploy flow" icon="map-pin">
        Use the admin api key and the [Merchant Account - Create](api-reference/merchant-account/merchant-account--create) endpoint to create your Merchant Account
      </Step>
    </Steps>
  </Step>

  <Step title="Set up Connectors">
    Connect the payment [connectors](api-reference/merchant-connector-account/merchant-connector--create) and payment methods that your organization will accept. Connectors could be a payment processor/facilitator/acquirer or a provider of specialized services like Fraud/Accounting

    <Steps>
      <Step title="Hyperswitch Dashboard flow" icon="box-open">
        In Dashboard go to Connectors -> <Tooltip tip="Adding other connectors (eg. Adyen) will require you to go through their respective documentation">+Connect a Dummy Processor</Tooltip>. Choose the payments methods to enable and complete setup.
      </Step>

      <Step title="Self-Deploy flow" icon="map-pin">
        Use the admin api key and the [Connector Account](api-reference/merchant-connector-account/merchant-connector--create) endpoints to set up a connector
      </Step>
    </Steps>
  </Step>

  <Step title="Try your first payment">
    You are all set! Go ahead and try the [Payments API](api-reference/payments/payments--create), be sure to try the different use cases provided
  </Step>

  <Step title="We are here to help" icon="circle-info">
    Test the use cases you are interested in and in case of difficulty, feel free to contact us on our [slack channel](https://join.slack.com/t/hyperswitch-io/shared_invite/zt-2jqxmpsbm-WXUENx022HjNEy~Ark7Orw)
  </Step>
</Steps>





# null

Hyperswitch provides flexible payment processing with multiple flow patterns to accommodate different business needs. The system supports one-time payments, saved payment methods, and recurring billing through a comprehensive API design.

```mermaid
graph TD
    A["Payment Request"] --> B{"Payment Type"}
    B -->|One-time| C["One-time Payment Flows"]
    B -->|Save for Future| D["Payment Method Storage"]
    B -->|Recurring| E["Recurring Payment Flows"]
    
    C --> C1["Instant Payment"]
    C --> C2["Manual Capture"]
    C --> C3["Decoupled Flow"]
    C --> C4["3DS Authentication"]
    
    D --> D1["Save During Payment"]
    D --> D2["List Saved Methods"]
    
    E --> E1["Setup (CIT)"]
    E --> E2["Execute (MIT)"]
```

## One-Time Payment Patterns

### 1. Instant Payment (Automatic Capture)

**Use Case:** Simple, immediate payment processing

**Endpoint:**
`POST /payments`

```mermaid
sequenceDiagram
    participant Client
    participant Hyperswitch
    participant Processor
    
    Client->>Hyperswitch: POST /payments<br/>{confirm: true, capture_method: "automatic"}
    Hyperswitch->>Processor: Authorize + Capture
    Processor-->>Hyperswitch: Payment Complete
    Hyperswitch-->>Client: Status: succeeded
```

**Required Fields:**

* `confirm: true`
* `capture_method: "automatic"`
* `payment_method`

**Final Status:** `succeeded`

### 2. Two-Step Manual Capture

**Use Case:** Deferred settlement (e.g., ship before charging)

```mermaid
sequenceDiagram
    participant Client
    participant Hyperswitch
    participant Processor
    
    Client->>Hyperswitch: POST /payments<br/>{confirm: true, capture_method: "manual"}
    Hyperswitch->>Processor: Authorize Only
    Processor-->>Hyperswitch: Authorization Hold
    Hyperswitch-->>Client: Status: requires_capture
    
    Note over Client: Ship goods, then capture
    
    Client->>Hyperswitch: POST /payments/{id}/capture
    Hyperswitch->>Processor: Capture Funds
    Processor-->>Hyperswitch: Capture Complete
    Hyperswitch-->>Client: Status: succeeded
```

**Flow:**

1. **Authorize:** `POST /payments` with `capture_method: "manual"`
2. **Status:** `requires_capture`
3. **Capture:** `POST /payments/{payment_id}/capture`
4. **Final Status:** `succeeded`

### 3. Fully Decoupled Flow

**Use Case:** Complex checkout journeys with multiple modification steps. Useful in headless checkout or B2B portals where data is filled progressively.

```mermaid
sequenceDiagram
    participant Client
    participant Hyperswitch
    
    Client->>Hyperswitch: POST /payments<br/>(Create Intent)
    Hyperswitch-->>Client: payment_id + client_secret
    
    Client->>Hyperswitch: POST /payments/{id}<br/>(Update: customer, amount, etc.)
    Hyperswitch-->>Client: Updated Intent
    
    Client->>Hyperswitch: POST /payments/{id}/confirm<br/>(Final Confirmation)
    Hyperswitch-->>Client: Status: succeeded/requires_capture
    
    opt Manual Capture
        Client->>Hyperswitch: POST /payments/{id}/capture
        Hyperswitch-->>Client: Status: succeeded
    end
```

**Endpoints:**

* **Create:**
  `POST /payments`
* **Update:**
  `POST /payments/{payment_id}`
* **Confirm:**
  `POST /payments/{payment_id}/confirm`
* **Capture:**
  `POST /payments/{payment_id}/capture` (if manual)

### 4. 3D Secure Authentication Flow

**Use Case:** Enhanced security with customer authentication

```mermaid
sequenceDiagram
    participant Client
    participant Hyperswitch
    participant Customer
    participant Bank
    
    Client->>Hyperswitch: POST /payments<br/>{authentication_type: "three_ds"}
    Hyperswitch-->>Client: Status: requires_customer_action<br/>+ redirect_url
    
    Client->>Customer: Redirect to 3DS page
    Customer->>Bank: Complete 3DS Challenge
    Bank-->>Hyperswitch: Authentication Result
    Hyperswitch->>Hyperswitch: Resume Payment Processing
    Hyperswitch-->>Client: Status: succeeded
```

**Additional Fields:**

* `authentication_type: "three_ds"`

**Status Progression:** `processing` → `requires_customer_action` → `succeeded`

## Payment Method Management

### 1. Saving Payment Methods

```mermaid
graph LR
    A["Payment Request"] --> B["Add setup_future_usage"]
    B --> C{"Usage Type"}
    C -->|"off_session"| D["For Recurring/MIT"]
    C -->|"on_session"| E["For Customer-Present"]
    D --> F["payment_method_id Returned"]
    E --> F
```

**During Payment Creation:**

* Add `setup_future_usage: "off_session"` or `"on_session"`
* Include `customer_id`
* **Result:** `payment_method_id` returned on success

**Understanding `setup_future_usage`:**

* **`on_session`**: Use when the customer is actively present during the transaction. This is typical for scenarios like saving card details for faster checkouts in subsequent sessions where the customer will still be present to initiate the payment (e.g., card vaulting for e-commerce sites).
* **`off_session`**: Use when you intend to charge the customer later without their active involvement at the time of charge. This is suitable for subscriptions, recurring billing, or merchant-initiated transactions (MITs) where the customer has pre-authorized future charges.

### 2. Using Saved Payment Methods

```mermaid
sequenceDiagram
    participant Client
    participant Hyperswitch
    
    Client->>Hyperswitch: POST /payments/create<br/>{customer_id}
    Hyperswitch-->>Client: client_secret
    
    Client->>Hyperswitch: GET /customers/payment_methods<br/>{client_secret, publishable_key}
    Hyperswitch-->>Client: List of payment_tokens
    
    Client->>Hyperswitch: POST /payments/{id}/confirm<br/>{payment_token}
    Hyperswitch-->>Client: Payment Result
```

**Steps:**

1. **Initiate:** Create payment with `customer_id`
2. **List:** Get saved cards via `GET /customers/payment_methods`
3. **Confirm:** Use selected `payment_token` in confirm call

### PCI Compliance and `payment_method_id`

Storing `payment_method_id` (which is a token representing the actual payment instrument, which could be a payment token, network token, or payment processor token) significantly reduces your PCI DSS scope. Hyperswitch securely stores the sensitive card details and provides you with this token. While you still need to ensure your systems handle `payment_method_id` and related customer data securely, you avoid the complexities of storing raw card numbers. Always consult with a PCI QSA to understand your specific compliance obligations.

## Recurring Payment Flows

### 3. Customer-Initiated Transaction (CIT) Setup

```mermaid
graph TD
    A["CIT Setup"] --> B{"Setup Type"}
    B -->|"With Charge"| C["Amount > 0<br/>setup_future_usage: off_session"]
    B -->|"Zero Dollar Auth"| D["Amount: 0<br/>payment_type: setup_mandate"]
    C --> E["payment_method_id"]
    D --> E
```

**Option 1 - Setup with Charge:**

* `setup_future_usage: "off_session"`
* `amount > 0`

**Option 2 - Zero Dollar Authorization:**

* `setup_future_usage: "off_session"`
* `amount: 0`
* `payment_type: "setup_mandate"`

### 4. Merchant-Initiated Transaction (MIT) Execution

```mermaid
sequenceDiagram
    participant Merchant
    participant Hyperswitch
    participant Processor
    
    Note over Merchant: Subscription billing trigger
    
    Merchant->>Hyperswitch: POST /payments<br/>{off_session: true, recurring_details}
    Hyperswitch->>Processor: Process with saved payment_method_id
    Processor-->>Hyperswitch: Payment Result
    Hyperswitch-->>Merchant: Status: succeeded
```

**Required Fields:**

* `off_session: true`
* `recurring_details: {
        "type": "payment_method_id",
        "data": "<from_setup>"}`

**Use Case:** Subscription charges, scheduled billing without customer interaction

## Status Flow Summary

```mermaid
stateDiagram-v2
    [*] --> RequiresConfirmation
    RequiresConfirmation --> Processing: confirm=true
    Processing --> RequiresCustomerAction: 3DS needed
    RequiresCustomerAction --> Processing: 3DS complete
    Processing --> RequiresCapture: manual capture
    Processing --> Succeeded: automatic capture
    RequiresCapture --> Succeeded: capture API call
    RequiresCapture --> PartiallyCaptured: partial capture
    PartiallyCaptured --> [*]
    Succeeded --> [*]
    Processing --> Failed: payment failed
    Failed --> [*]
```

## Notes

* **Terminal States:** `succeeded`, `failed`, `cancelled`, `partially_captured` are terminal states requiring no further action
* **Capture Methods:** System supports `automatic` (funds captured immediately), `manual` (funds captured in a separate step), `manual_multiple` (funds captured in multiple partial amounts via separate steps), and `scheduled` (funds captured automatically at a future predefined time) capture methods.
* **Authentication:** 3DS authentication automatically resumes payment processing after customer completion
* **MIT Compliance:** Off-session recurring payments follow industry standards for merchant-initiated transactions





# null

Hyperswitch provides flexible payment processing with multiple flow patterns to accommodate different business needs. The system supports one-time payments, saved payment methods, and recurring billing through a comprehensive API design.

```mermaid
graph TD
    A["Payment Request"] --> B{"Payment Type"}
    B -->|One-time| C["One-time Payment Flows"]
    B -->|Save for Future| D["Payment Method Storage"]
    B -->|Recurring| E["Recurring Payment Flows"]
    
    C --> C1["Instant Payment"]
    C --> C2["Manual Capture"]
    C --> C3["Decoupled Flow"]
    C --> C4["3DS Authentication"]
    
    D --> D1["Save During Payment"]
    D --> D2["List Saved Methods"]
    
    E --> E1["Setup (CIT)"]
    E --> E2["Execute (MIT)"]
```

## One-Time Payment Patterns

### 1. Instant Payment (Automatic Capture)

**Use Case:** Simple, immediate payment processing

**Endpoint:**
`POST /payments`

```mermaid
sequenceDiagram
    participant Client
    participant Hyperswitch
    participant Processor
    
    Client->>Hyperswitch: POST /payments<br/>{confirm: true, capture_method: "automatic"}
    Hyperswitch->>Processor: Authorize + Capture
    Processor-->>Hyperswitch: Payment Complete
    Hyperswitch-->>Client: Status: succeeded
```

**Required Fields:**

* `confirm: true`
* `capture_method: "automatic"`
* `payment_method`

**Final Status:** `succeeded`

### 2. Two-Step Manual Capture

**Use Case:** Deferred settlement (e.g., ship before charging)

```mermaid
sequenceDiagram
    participant Client
    participant Hyperswitch
    participant Processor
    
    Client->>Hyperswitch: POST /payments<br/>{confirm: true, capture_method: "manual"}
    Hyperswitch->>Processor: Authorize Only
    Processor-->>Hyperswitch: Authorization Hold
    Hyperswitch-->>Client: Status: requires_capture
    
    Note over Client: Ship goods, then capture
    
    Client->>Hyperswitch: POST /payments/{id}/capture
    Hyperswitch->>Processor: Capture Funds
    Processor-->>Hyperswitch: Capture Complete
    Hyperswitch-->>Client: Status: succeeded
```

**Flow:**

1. **Authorize:** `POST /payments` with `capture_method: "manual"`
2. **Status:** `requires_capture`
3. **Capture:** `POST /payments/{payment_id}/capture`
4. **Final Status:** `succeeded`

### 3. Fully Decoupled Flow

**Use Case:** Complex checkout journeys with multiple modification steps. Useful in headless checkout or B2B portals where data is filled progressively.

```mermaid
sequenceDiagram
    participant Client
    participant Hyperswitch
    
    Client->>Hyperswitch: POST /payments<br/>(Create Intent)
    Hyperswitch-->>Client: payment_id + client_secret
    
    Client->>Hyperswitch: POST /payments/{id}<br/>(Update: customer, amount, etc.)
    Hyperswitch-->>Client: Updated Intent
    
    Client->>Hyperswitch: POST /payments/{id}/confirm<br/>(Final Confirmation)
    Hyperswitch-->>Client: Status: succeeded/requires_capture
    
    opt Manual Capture
        Client->>Hyperswitch: POST /payments/{id}/capture
        Hyperswitch-->>Client: Status: succeeded
    end
```

**Endpoints:**

* **Create:**
  `POST /payments`
* **Update:**
  `POST /payments/{payment_id}`
* **Confirm:**
  `POST /payments/{payment_id}/confirm`
* **Capture:**
  `POST /payments/{payment_id}/capture` (if manual)

### 4. 3D Secure Authentication Flow

**Use Case:** Enhanced security with customer authentication

```mermaid
sequenceDiagram
    participant Client
    participant Hyperswitch
    participant Customer
    participant Bank
    
    Client->>Hyperswitch: POST /payments<br/>{authentication_type: "three_ds"}
    Hyperswitch-->>Client: Status: requires_customer_action<br/>+ redirect_url
    
    Client->>Customer: Redirect to 3DS page
    Customer->>Bank: Complete 3DS Challenge
    Bank-->>Hyperswitch: Authentication Result
    Hyperswitch->>Hyperswitch: Resume Payment Processing
    Hyperswitch-->>Client: Status: succeeded
```

**Additional Fields:**

* `authentication_type: "three_ds"`

**Status Progression:** `processing` → `requires_customer_action` → `succeeded`

## Payment Method Management

### 1. Saving Payment Methods

```mermaid
graph LR
    A["Payment Request"] --> B["Add setup_future_usage"]
    B --> C{"Usage Type"}
    C -->|"off_session"| D["For Recurring/MIT"]
    C -->|"on_session"| E["For Customer-Present"]
    D --> F["payment_method_id Returned"]
    E --> F
```

**During Payment Creation:**

* Add `setup_future_usage: "off_session"` or `"on_session"`
* Include `customer_id`
* **Result:** `payment_method_id` returned on success

**Understanding `setup_future_usage`:**

* **`on_session`**: Use when the customer is actively present during the transaction. This is typical for scenarios like saving card details for faster checkouts in subsequent sessions where the customer will still be present to initiate the payment (e.g., card vaulting for e-commerce sites).
* **`off_session`**: Use when you intend to charge the customer later without their active involvement at the time of charge. This is suitable for subscriptions, recurring billing, or merchant-initiated transactions (MITs) where the customer has pre-authorized future charges.

### 2. Using Saved Payment Methods

```mermaid
sequenceDiagram
    participant Client
    participant Hyperswitch
    
    Client->>Hyperswitch: POST /payments/create<br/>{customer_id}
    Hyperswitch-->>Client: client_secret
    
    Client->>Hyperswitch: GET /customers/payment_methods<br/>{client_secret, publishable_key}
    Hyperswitch-->>Client: List of payment_tokens
    
    Client->>Hyperswitch: POST /payments/{id}/confirm<br/>{payment_token}
    Hyperswitch-->>Client: Payment Result
```

**Steps:**

1. **Initiate:** Create payment with `customer_id`
2. **List:** Get saved cards via `GET /customers/payment_methods`
3. **Confirm:** Use selected `payment_token` in confirm call

### PCI Compliance and `payment_method_id`

Storing `payment_method_id` (which is a token representing the actual payment instrument, which could be a payment token, network token, or payment processor token) significantly reduces your PCI DSS scope. Hyperswitch securely stores the sensitive card details and provides you with this token. While you still need to ensure your systems handle `payment_method_id` and related customer data securely, you avoid the complexities of storing raw card numbers. Always consult with a PCI QSA to understand your specific compliance obligations.

## Recurring Payment Flows

### 3. Customer-Initiated Transaction (CIT) Setup

```mermaid
graph TD
    A["CIT Setup"] --> B{"Setup Type"}
    B -->|"With Charge"| C["Amount > 0<br/>setup_future_usage: off_session"]
    B -->|"Zero Dollar Auth"| D["Amount: 0<br/>payment_type: setup_mandate"]
    C --> E["payment_method_id"]
    D --> E
```

**Option 1 - Setup with Charge:**

* `setup_future_usage: "off_session"`
* `amount > 0`

**Option 2 - Zero Dollar Authorization:**

* `setup_future_usage: "off_session"`
* `amount: 0`
* `payment_type: "setup_mandate"`

### 4. Merchant-Initiated Transaction (MIT) Execution

```mermaid
sequenceDiagram
    participant Merchant
    participant Hyperswitch
    participant Processor
    
    Note over Merchant: Subscription billing trigger
    
    Merchant->>Hyperswitch: POST /payments<br/>{off_session: true, recurring_details}
    Hyperswitch->>Processor: Process with saved payment_method_id
    Processor-->>Hyperswitch: Payment Result
    Hyperswitch-->>Merchant: Status: succeeded
```

**Required Fields:**

* `off_session: true`
* `recurring_details: {
        "type": "payment_method_id",
        "data": "<from_setup>"}`

**Use Case:** Subscription charges, scheduled billing without customer interaction

## Status Flow Summary

```mermaid
stateDiagram-v2
    [*] --> RequiresConfirmation
    RequiresConfirmation --> Processing: confirm=true
    Processing --> RequiresCustomerAction: 3DS needed
    RequiresCustomerAction --> Processing: 3DS complete
    Processing --> RequiresCapture: manual capture
    Processing --> Succeeded: automatic capture
    RequiresCapture --> Succeeded: capture API call
    RequiresCapture --> PartiallyCaptured: partial capture
    PartiallyCaptured --> [*]
    Succeeded --> [*]
    Processing --> Failed: payment failed
    Failed --> [*]
```

## Notes

* **Terminal States:** `succeeded`, `failed`, `cancelled`, `partially_captured` are terminal states requiring no further action
* **Capture Methods:** System supports `automatic` (funds captured immediately), `manual` (funds captured in a separate step), `manual_multiple` (funds captured in multiple partial amounts via separate steps), and `scheduled` (funds captured automatically at a future predefined time) capture methods.
* **Authentication:** 3DS authentication automatically resumes payment processing after customer completion
* **MIT Compliance:** Off-session recurring payments follow industry standards for merchant-initiated transactions


# PaymentMethods - Create

> Creates and stores a payment method against a customer.
In case of cards, this API should be used only by PCI compliant merchants.

## OpenAPI

````yaml post /payment_methods
paths:
  path: /payment_methods
  method: post
  servers:
    - url: https://sandbox.hyperswitch.io
      description: Sandbox Environment
  request:
    security:
      - title: api key
        parameters:
          query: {}
          header:
            api-key:
              type: apiKey
              description: >-
                Use the API key created under your merchant account from the
                HyperSwitch dashboard. API key is used to authenticate API
                requests from your merchant server only. Don't expose this key
                on a website or embed it in a mobile application.
          cookie: {}
    parameters:
      path: {}
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              payment_method:
                allOf:
                  - $ref: '#/components/schemas/PaymentMethod'
              payment_method_type:
                allOf:
                  - allOf:
                      - $ref: '#/components/schemas/PaymentMethodType'
                    nullable: true
              payment_method_issuer:
                allOf:
                  - type: string
                    description: >-
                      The name of the bank/ provider issuing the payment method
                      to the end user
                    example: Citibank
                    nullable: true
              payment_method_issuer_code:
                allOf:
                  - allOf:
                      - $ref: '#/components/schemas/PaymentMethodIssuerCode'
                    nullable: true
              card:
                allOf:
                  - allOf:
                      - $ref: '#/components/schemas/CardDetail'
                    nullable: true
              metadata:
                allOf:
                  - type: object
                    description: >-
                      You can specify up to 50 keys, with key names up to 40
                      characters long and values up to 500 characters long.
                      Metadata is useful for storing additional, structured
                      information on an object.
                    nullable: true
              customer_id:
                allOf:
                  - type: string
                    description: The unique identifier of the customer.
                    example: cus_y3oqhf46pyzuxjbcn2giaqnb44
                    nullable: true
                    maxLength: 64
                    minLength: 1
              card_network:
                allOf:
                  - type: string
                    description: The card network
                    example: Visa
                    nullable: true
              bank_transfer:
                allOf:
                  - allOf:
                      - $ref: '#/components/schemas/Bank'
                    nullable: true
              wallet:
                allOf:
                  - allOf:
                      - $ref: '#/components/schemas/Wallet'
                    nullable: true
              client_secret:
                allOf:
                  - type: string
                    description: |-
                      For Client based calls, SDK will use the client_secret
                      in order to call /payment_methods
                      Client secret will be generated whenever a new
                      payment method is created
                    nullable: true
              payment_method_data:
                allOf:
                  - allOf:
                      - $ref: '#/components/schemas/PaymentMethodCreateData'
                    nullable: true
              billing:
                allOf:
                  - allOf:
                      - $ref: '#/components/schemas/Address'
                    nullable: true
            required: true
            refIdentifier: '#/components/schemas/PaymentMethodCreate'
            requiredProperties:
              - payment_method
            additionalProperties: false
        examples:
          Save a card:
            value:
              card:
                card_exp_month: '11'
                card_exp_year: '25'
                card_holder_name: John Doe
                card_number: '4242424242424242'
              customer_id: '{{customer_id}}'
              payment_method: card
              payment_method_issuer: Visa
              payment_method_type: credit
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              merchant_id:
                allOf:
                  - type: string
                    description: Unique identifier for a merchant
                    example: merchant_1671528864
              customer_id:
                allOf:
                  - type: string
                    description: The unique identifier of the customer.
                    example: cus_y3oqhf46pyzuxjbcn2giaqnb44
                    nullable: true
                    maxLength: 64
                    minLength: 1
              payment_method_id:
                allOf:
                  - type: string
                    description: The unique identifier of the Payment method
                    example: card_rGK4Vi5iSW70MY7J2mIg
              payment_method:
                allOf:
                  - $ref: '#/components/schemas/PaymentMethod'
              payment_method_type:
                allOf:
                  - allOf:
                      - $ref: '#/components/schemas/PaymentMethodType'
                    nullable: true
              card:
                allOf:
                  - allOf:
                      - $ref: '#/components/schemas/CardDetailFromLocker'
                    nullable: true
              recurring_enabled:
                allOf:
                  - type: boolean
                    description: >-
                      Indicates whether the payment method supports recurring
                      payments. Optional.
                    example: true
                    nullable: true
              installment_payment_enabled:
                allOf:
                  - type: boolean
                    description: >-
                      Indicates whether the payment method is eligible for
                      installment payments (e.g., EMI, BNPL). Optional.
                    example: true
                    nullable: true
              payment_experience:
                allOf:
                  - type: array
                    items:
                      $ref: '#/components/schemas/PaymentExperience'
                    description: Type of payment experience enabled with the connector
                    example:
                      - redirect_to_url
                    nullable: true
              metadata:
                allOf:
                  - type: object
                    description: >-
                      You can specify up to 50 keys, with key names up to 40
                      characters long and values up to 500 characters long.
                      Metadata is useful for storing additional, structured
                      information on an object.
                    nullable: true
              created:
                allOf:
                  - type: string
                    format: date-time
                    description: >-
                      A timestamp (ISO 8601 code) that determines when the
                      payment method was created
                    example: '2023-01-18T11:04:09.922Z'
                    nullable: true
              bank_transfer:
                allOf:
                  - allOf:
                      - $ref: '#/components/schemas/Bank'
                    nullable: true
              last_used_at:
                allOf:
                  - type: string
                    format: date-time
                    example: '2024-02-24T11:04:09.922Z'
                    nullable: true
              client_secret:
                allOf:
                  - type: string
                    description: For Client based calls
                    nullable: true
            refIdentifier: '#/components/schemas/PaymentMethodResponse'
            requiredProperties:
              - merchant_id
              - payment_method_id
              - payment_method
        examples:
          example:
            value:
              merchant_id: merchant_1671528864
              customer_id: cus_y3oqhf46pyzuxjbcn2giaqnb44
              payment_method_id: card_rGK4Vi5iSW70MY7J2mIg
              payment_method: card
              payment_method_type: ach
              card:
                scheme: <string>
                issuer_country: <string>
                last4_digits: <string>
                expiry_month: <string>
                expiry_year: <string>
                card_token: <string>
                card_holder_name: <string>
                card_fingerprint: <string>
                nick_name: <string>
                card_network: Visa
                card_isin: <string>
                card_issuer: <string>
                card_type: <string>
                saved_to_locker: true
              recurring_enabled: true
              installment_payment_enabled: true
              payment_experience:
                - redirect_to_url
              metadata: {}
              created: '2023-01-18T11:04:09.922Z'
              bank_transfer:
                bank_name: Deutsche Bank
                bank_country_code: AF
                bank_city: California
                bank_account_number: '000123456'
                bank_routing_number: '110000000'
              last_used_at: '2024-02-24T11:04:09.922Z'
              client_secret: <string>
        description: Payment Method Created
    '400':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Invalid Data
        examples: {}
        description: Invalid Data
  deprecated: false
  type: path
components:
  schemas:
    AchBankTransfer:
      type: object
      required:
        - bank_account_number
        - bank_routing_number
      properties:
        bank_name:
          type: string
          description: Bank name
          example: Deutsche Bank
          nullable: true
        bank_country_code:
          allOf:
            - $ref: '#/components/schemas/CountryAlpha2'
          nullable: true
        bank_city:
          type: string
          description: Bank city
          example: California
          nullable: true
        bank_account_number:
          type: string
          description: >-
            Bank account number is an unique identifier assigned by a bank to a
            customer.
          example: '000123456'
        bank_routing_number:
          type: string
          description: >-
            [9 digits] Routing number - used in USA for identifying a specific
            bank.
          example: '110000000'
    Address:
      type: object
      properties:
        address:
          allOf:
            - $ref: '#/components/schemas/AddressDetails'
          nullable: true
        phone:
          allOf:
            - $ref: '#/components/schemas/PhoneDetails'
          nullable: true
        email:
          type: string
          nullable: true
    AddressDetails:
      type: object
      description: Address details
      properties:
        city:
          type: string
          description: The city, district, suburb, town, or village of the address.
          example: New York
          nullable: true
          maxLength: 50
        country:
          allOf:
            - $ref: '#/components/schemas/CountryAlpha2'
          nullable: true
        line1:
          type: string
          description: The first line of the street address or P.O. Box.
          example: 123, King Street
          nullable: true
          maxLength: 200
        line2:
          type: string
          description: >-
            The second line of the street address or P.O. Box (e.g., apartment,
            suite, unit, or building).
          example: Powelson Avenue
          nullable: true
          maxLength: 50
        line3:
          type: string
          description: The third line of the street address, if applicable.
          example: Bridgewater
          nullable: true
          maxLength: 50
        zip:
          type: string
          description: The zip/postal code for the address
          example: '08807'
          nullable: true
          maxLength: 50
        state:
          type: string
          description: The address state
          example: New York
          nullable: true
        first_name:
          type: string
          description: The first name for the address
          example: John
          nullable: true
          maxLength: 255
        last_name:
          type: string
          description: The last name for the address
          example: Doe
          nullable: true
          maxLength: 255
        origin_zip:
          type: string
          description: The zip/postal code of the origin
          example: '08807'
          nullable: true
          maxLength: 50
    BacsBankTransfer:
      type: object
      required:
        - bank_account_number
        - bank_sort_code
      properties:
        bank_name:
          type: string
          description: Bank name
          example: Deutsche Bank
          nullable: true
        bank_country_code:
          allOf:
            - $ref: '#/components/schemas/CountryAlpha2'
          nullable: true
        bank_city:
          type: string
          description: Bank city
          example: California
          nullable: true
        bank_account_number:
          type: string
          description: >-
            Bank account number is an unique identifier assigned by a bank to a
            customer.
          example: '000123456'
        bank_sort_code:
          type: string
          description: >-
            [6 digits] Sort Code - used in UK and Ireland for identifying a bank
            and it's branches.
          example: 98-76-54
    Bank:
      oneOf:
        - $ref: '#/components/schemas/AchBankTransfer'
        - $ref: '#/components/schemas/BacsBankTransfer'
        - $ref: '#/components/schemas/SepaBankTransfer'
        - $ref: '#/components/schemas/PixBankTransfer'
    CardDetail:
      type: object
      required:
        - card_number
        - card_exp_month
        - card_exp_year
        - card_holder_name
      properties:
        card_number:
          type: string
          description: Card Number
          example: '4111111145551142'
        card_exp_month:
          type: string
          description: Card Expiry Month
          example: '10'
        card_exp_year:
          type: string
          description: Card Expiry Year
          example: '25'
        card_holder_name:
          type: string
          description: Card Holder Name
          example: John Doe
        nick_name:
          type: string
          description: Card Holder's Nick Name
          example: John Doe
          nullable: true
        card_issuing_country:
          type: string
          description: Card Issuing Country
          nullable: true
        card_network:
          allOf:
            - $ref: '#/components/schemas/CardNetwork'
          nullable: true
        card_issuer:
          type: string
          description: Issuer Bank for Card
          nullable: true
        card_type:
          type: string
          description: Card Type
          nullable: true
      additionalProperties: false
    CardDetailFromLocker:
      type: object
      required:
        - saved_to_locker
      properties:
        scheme:
          type: string
          nullable: true
        issuer_country:
          type: string
          nullable: true
        last4_digits:
          type: string
          nullable: true
        expiry_month:
          type: string
          nullable: true
        expiry_year:
          type: string
          nullable: true
        card_token:
          type: string
          nullable: true
        card_holder_name:
          type: string
          nullable: true
        card_fingerprint:
          type: string
          nullable: true
        nick_name:
          type: string
          nullable: true
        card_network:
          allOf:
            - $ref: '#/components/schemas/CardNetwork'
          nullable: true
        card_isin:
          type: string
          nullable: true
        card_issuer:
          type: string
          nullable: true
        card_type:
          type: string
          nullable: true
        saved_to_locker:
          type: boolean
    CardNetwork:
      type: string
      description: Indicates the card network.
      enum:
        - Visa
        - Mastercard
        - AmericanExpress
        - JCB
        - DinersClub
        - Discover
        - CartesBancaires
        - UnionPay
        - Interac
        - RuPay
        - Maestro
        - Star
        - Pulse
        - Accel
        - Nyce
    CountryAlpha2:
      type: string
      enum:
        - AF
        - AX
        - AL
        - DZ
        - AS
        - AD
        - AO
        - AI
        - AQ
        - AG
        - AR
        - AM
        - AW
        - AU
        - AT
        - AZ
        - BS
        - BH
        - BD
        - BB
        - BY
        - BE
        - BZ
        - BJ
        - BM
        - BT
        - BO
        - BQ
        - BA
        - BW
        - BV
        - BR
        - IO
        - BN
        - BG
        - BF
        - BI
        - KH
        - CM
        - CA
        - CV
        - KY
        - CF
        - TD
        - CL
        - CN
        - CX
        - CC
        - CO
        - KM
        - CG
        - CD
        - CK
        - CR
        - CI
        - HR
        - CU
        - CW
        - CY
        - CZ
        - DK
        - DJ
        - DM
        - DO
        - EC
        - EG
        - SV
        - GQ
        - ER
        - EE
        - ET
        - FK
        - FO
        - FJ
        - FI
        - FR
        - GF
        - PF
        - TF
        - GA
        - GM
        - GE
        - DE
        - GH
        - GI
        - GR
        - GL
        - GD
        - GP
        - GU
        - GT
        - GG
        - GN
        - GW
        - GY
        - HT
        - HM
        - VA
        - HN
        - HK
        - HU
        - IS
        - IN
        - ID
        - IR
        - IQ
        - IE
        - IM
        - IL
        - IT
        - JM
        - JP
        - JE
        - JO
        - KZ
        - KE
        - KI
        - KP
        - KR
        - KW
        - KG
        - LA
        - LV
        - LB
        - LS
        - LR
        - LY
        - LI
        - LT
        - LU
        - MO
        - MK
        - MG
        - MW
        - MY
        - MV
        - ML
        - MT
        - MH
        - MQ
        - MR
        - MU
        - YT
        - MX
        - FM
        - MD
        - MC
        - MN
        - ME
        - MS
        - MA
        - MZ
        - MM
        - NA
        - NR
        - NP
        - NL
        - NC
        - NZ
        - NI
        - NE
        - NG
        - NU
        - NF
        - MP
        - 'NO'
        - OM
        - PK
        - PW
        - PS
        - PA
        - PG
        - PY
        - PE
        - PH
        - PN
        - PL
        - PT
        - PR
        - QA
        - RE
        - RO
        - RU
        - RW
        - BL
        - SH
        - KN
        - LC
        - MF
        - PM
        - VC
        - WS
        - SM
        - ST
        - SA
        - SN
        - RS
        - SC
        - SL
        - SG
        - SX
        - SK
        - SI
        - SB
        - SO
        - ZA
        - GS
        - SS
        - ES
        - LK
        - SD
        - SR
        - SJ
        - SZ
        - SE
        - CH
        - SY
        - TW
        - TJ
        - TZ
        - TH
        - TL
        - TG
        - TK
        - TO
        - TT
        - TN
        - TR
        - TM
        - TC
        - TV
        - UG
        - UA
        - AE
        - GB
        - UM
        - UY
        - UZ
        - VU
        - VE
        - VN
        - VG
        - VI
        - WF
        - EH
        - YE
        - ZM
        - ZW
        - US
    PaymentExperience:
      type: string
      description: >-
        To indicate the type of payment experience that the customer would go
        through
      enum:
        - redirect_to_url
        - invoke_sdk_client
        - display_qr_code
        - one_click
        - link_wallet
        - invoke_payment_app
        - display_wait_screen
        - collect_otp
    PaymentMethod:
      type: string
      description: 'Indicates the type of payment method. Eg: ''card'', ''wallet'', etc.'
      enum:
        - card
        - card_redirect
        - pay_later
        - wallet
        - bank_redirect
        - bank_transfer
        - crypto
        - bank_debit
        - reward
        - real_time_payment
        - upi
        - voucher
        - gift_card
        - open_banking
        - mobile_payment
    PaymentMethodCreateData:
      oneOf:
        - type: object
          required:
            - card
          properties:
            card:
              $ref: '#/components/schemas/CardDetail'
    PaymentMethodIssuerCode:
      type: string
      enum:
        - jp_hdfc
        - jp_icici
        - jp_googlepay
        - jp_applepay
        - jp_phonepay
        - jp_wechat
        - jp_sofort
        - jp_giropay
        - jp_sepa
        - jp_bacs
    PaymentMethodType:
      type: string
      description: >-
        Indicates the sub type of payment method. Eg: 'google_pay' & 'apple_pay'
        for wallets.
      enum:
        - ach
        - affirm
        - afterpay_clearpay
        - alfamart
        - ali_pay
        - ali_pay_hk
        - alma
        - amazon_pay
        - paysera
        - apple_pay
        - atome
        - bacs
        - bancontact_card
        - becs
        - benefit
        - bizum
        - blik
        - bluecode
        - boleto
        - bca_bank_transfer
        - bni_va
        - breadpay
        - bri_va
        - bhn_card_network
        - card_redirect
        - cimb_va
        - classic
        - credit
        - crypto_currency
        - cashapp
        - dana
        - danamon_va
        - debit
        - duit_now
        - efecty
        - eft
        - eps
        - flexiti
        - fps
        - evoucher
        - giropay
        - givex
        - google_pay
        - go_pay
        - gcash
        - ideal
        - interac
        - indomaret
        - klarna
        - kakao_pay
        - local_bank_redirect
        - mandiri_va
        - knet
        - mb_way
        - mobile_pay
        - momo
        - momo_atm
        - multibanco
        - online_banking_thailand
        - online_banking_czech_republic
        - online_banking_finland
        - online_banking_fpx
        - online_banking_poland
        - online_banking_slovakia
        - oxxo
        - pago_efectivo
        - permata_bank_transfer
        - open_banking_uk
        - pay_bright
        - paypal
        - paze
        - pix
        - pay_safe_card
        - przelewy24
        - prompt_pay
        - pse
        - red_compra
        - red_pagos
        - samsung_pay
        - sepa
        - sepa_bank_transfer
        - skrill
        - sofort
        - swish
        - touch_n_go
        - trustly
        - twint
        - upi_collect
        - upi_intent
        - vipps
        - viet_qr
        - venmo
        - walley
        - we_chat_pay
        - seven_eleven
        - lawson
        - mini_stop
        - family_mart
        - seicomart
        - pay_easy
        - local_bank_transfer
        - mifinity
        - open_banking_pis
        - direct_carrier_billing
        - instant_bank_transfer
        - instant_bank_transfer_finland
        - instant_bank_transfer_poland
        - revolut_pay
        - indonesian_bank_transfer
    Paypal:
      type: object
      required:
        - email
        - telephone_number
        - paypal_id
      properties:
        email:
          type: string
          description: Email linked with paypal account
          example: john.doe@example.com
        telephone_number:
          type: string
          description: mobile number linked to paypal account
          example: '16608213349'
        paypal_id:
          type: string
          description: id of the paypal account
          example: G83KXTJ5EHCQ2
    PhoneDetails:
      type: object
      properties:
        number:
          type: string
          description: The contact number
          example: '9123456789'
          nullable: true
        country_code:
          type: string
          description: The country code attached to the number
          example: '+1'
          nullable: true
    PixBankTransfer:
      type: object
      required:
        - bank_account_number
        - pix_key
      properties:
        bank_name:
          type: string
          description: Bank name
          example: Deutsche Bank
          nullable: true
        bank_branch:
          type: string
          description: Bank branch
          example: '3707'
          nullable: true
        bank_account_number:
          type: string
          description: >-
            Bank account number is an unique identifier assigned by a bank to a
            customer.
          example: '000123456'
        pix_key:
          type: string
          description: Unique key for pix customer
          example: '000123456'
        tax_id:
          type: string
          description: Individual taxpayer identification number
          example: '000123456'
          nullable: true
    SepaBankTransfer:
      type: object
      required:
        - iban
        - bic
      properties:
        bank_name:
          type: string
          description: Bank name
          example: Deutsche Bank
          nullable: true
        bank_country_code:
          allOf:
            - $ref: '#/components/schemas/CountryAlpha2'
          nullable: true
        bank_city:
          type: string
          description: Bank city
          example: California
          nullable: true
        iban:
          type: string
          description: >-
            International Bank Account Number (iban) - used in many countries
            for identifying a bank along with it's customer.
          example: DE89370400440532013000
        bic:
          type: string
          description: >-
            [8 / 11 digits] Bank Identifier Code (bic) / Swift Code - used in
            many countries for identifying a bank and it's branches
          example: HSBCGB2LXXX
    Venmo:
      type: object
      required:
        - telephone_number
      properties:
        telephone_number:
          type: string
          description: mobile number linked to venmo account
          example: '16608213349'
    Wallet:
      oneOf:
        - type: object
          required:
            - paypal
          properties:
            paypal:
              $ref: '#/components/schemas/Paypal'
        - type: object
          required:
            - venmo
          properties:
            venmo:
              $ref: '#/components/schemas/Venmo'

````




# Organization - Retrieve

> Retrieve an existing organization

## OpenAPI

````yaml get /organization/{id}
paths:
  path: /organization/{id}
  method: get
  servers:
    - url: https://sandbox.hyperswitch.io
      description: Sandbox Environment
  request:
    security:
      - title: admin api key
        parameters:
          query: {}
          header:
            api-key:
              type: apiKey
              description: >-
                Admin API keys allow you to perform some privileged actions such
                as creating a merchant account and Merchant Connector account.
          cookie: {}
    parameters:
      path:
        id:
          schema:
            - type: string
              required: true
              description: The unique identifier for the Organization
      query: {}
      header: {}
      cookie: {}
    body: {}
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              organization_id:
                allOf:
                  - type: string
                    description: The unique identifier for the Organization
                    example: org_q98uSGAYbjEwqs0mJwnz
                    maxLength: 64
                    minLength: 1
              organization_name:
                allOf:
                  - type: string
                    description: Name of the Organization
                    nullable: true
              organization_details:
                allOf:
                  - type: object
                    description: Details about the organization
                    nullable: true
              metadata:
                allOf:
                  - type: object
                    description: >-
                      Metadata is useful for storing additional, unstructured
                      information on an object.
                    nullable: true
              modified_at:
                allOf:
                  - type: string
                    format: date-time
              created_at:
                allOf:
                  - type: string
                    format: date-time
              organization_type:
                allOf:
                  - allOf:
                      - $ref: '#/components/schemas/OrganizationType'
                    nullable: true
            refIdentifier: '#/components/schemas/OrganizationResponse'
            requiredProperties:
              - organization_id
              - modified_at
              - created_at
        examples:
          example:
            value:
              organization_id: org_q98uSGAYbjEwqs0mJwnz
              organization_name: <string>
              organization_details: {}
              metadata: {}
              modified_at: '2023-11-07T05:31:56Z'
              created_at: '2023-11-07T05:31:56Z'
              organization_type: standard
        description: Organization Created
    '400':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Invalid data
        examples: {}
        description: Invalid data
  deprecated: false
  type: path
components:
  schemas:
    OrganizationType:
      type: string
      enum:
        - standard
        - platform

````




# Organization - Update

> Create a new organization for .

## OpenAPI

````yaml put /organization/{id}
paths:
  path: /organization/{id}
  method: put
  servers:
    - url: https://sandbox.hyperswitch.io
      description: Sandbox Environment
  request:
    security:
      - title: admin api key
        parameters:
          query: {}
          header:
            api-key:
              type: apiKey
              description: >-
                Admin API keys allow you to perform some privileged actions such
                as creating a merchant account and Merchant Connector account.
          cookie: {}
    parameters:
      path:
        id:
          schema:
            - type: string
              required: true
              description: The unique identifier for the Organization
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              organization_name:
                allOf:
                  - type: string
                    description: Name of the organization
                    nullable: true
              organization_details:
                allOf:
                  - type: object
                    description: Details about the organization
                    nullable: true
              metadata:
                allOf:
                  - type: object
                    description: >-
                      Metadata is useful for storing additional, unstructured
                      information on an object.
                    nullable: true
              platform_merchant_id:
                allOf:
                  - type: string
                    description: >-
                      Platform merchant id is unique distiguisher for special
                      merchant in the platform org
            required: true
            refIdentifier: '#/components/schemas/OrganizationUpdateRequest'
            requiredProperties:
              - platform_merchant_id
            additionalProperties: false
        examples:
          Update organization_name of the organization:
            value:
              organization_name: organization_abcd
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              organization_id:
                allOf:
                  - type: string
                    description: The unique identifier for the Organization
                    example: org_q98uSGAYbjEwqs0mJwnz
                    maxLength: 64
                    minLength: 1
              organization_name:
                allOf:
                  - type: string
                    description: Name of the Organization
                    nullable: true
              organization_details:
                allOf:
                  - type: object
                    description: Details about the organization
                    nullable: true
              metadata:
                allOf:
                  - type: object
                    description: >-
                      Metadata is useful for storing additional, unstructured
                      information on an object.
                    nullable: true
              modified_at:
                allOf:
                  - type: string
                    format: date-time
              created_at:
                allOf:
                  - type: string
                    format: date-time
              organization_type:
                allOf:
                  - allOf:
                      - $ref: '#/components/schemas/OrganizationType'
                    nullable: true
            refIdentifier: '#/components/schemas/OrganizationResponse'
            requiredProperties:
              - organization_id
              - modified_at
              - created_at
        examples:
          example:
            value:
              organization_id: org_q98uSGAYbjEwqs0mJwnz
              organization_name: <string>
              organization_details: {}
              metadata: {}
              modified_at: '2023-11-07T05:31:56Z'
              created_at: '2023-11-07T05:31:56Z'
              organization_type: standard
        description: Organization Created
    '400':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Invalid data
        examples: {}
        description: Invalid data
  deprecated: false
  type: path
components:
  schemas:
    OrganizationType:
      type: string
      enum:
        - standard
        - platform

````