
export interface IEmailRequestBody {
    senderName: string
    senderEmail: string,
    messageBody: string;
}

export interface IEmailJSSendBody {
    service_id: string,
    template_id: string,
    user_id: string,
    accessToken: string,
    template_params: {
        fromName: string,
        message: string,
        fromEmail: string
    }
}