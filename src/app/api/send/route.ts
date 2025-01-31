import {
  EmailTemplate,
  EmailTemplateProps,
} from "../../../components/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body: EmailTemplateProps | { email: string } = await request.json();
  console.log("hello this is post request in send api");

  try {
    const { data, error } = await resend.emails.send({
      from: "shivansh@shivn.tech",
      to: [`${(body as { email: string }).email}`],
      subject: "Hello world",
      react: EmailTemplate({ ...(body as EmailTemplateProps) }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
