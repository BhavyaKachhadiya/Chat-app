import "@/app/globals.css";
import Provider from "@/app/components/Provider";
import Wrapper from "@/app/components/Wrapper";

export const metadata = {
  title: "chat",
  description: "Chat app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <Provider>
          <Wrapper>
          {children}
          </Wrapper>
        </Provider>
      </body>
    </html>
  );
}