import './globals.css';
import { AuthProvider } from './contexts/AuthContext';

export const metadata = {
  title: 'ToDo App',
  description: 'App de tarefas com Next.js e .NET Core',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}