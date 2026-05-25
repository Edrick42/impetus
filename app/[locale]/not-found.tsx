import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">404</p>
      <h1 className="mt-4 font-display text-4xl font-medium md:text-5xl">
        Página não encontrada
      </h1>
      <p className="mt-4 max-w-md text-muted">
        O conteúdo que você procura pode ter sido movido ou ainda não existe.
      </p>
      <ButtonLink href="/" className="mt-8">
        Voltar ao início
      </ButtonLink>
    </Container>
  );
}
