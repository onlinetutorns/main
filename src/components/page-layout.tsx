type PageLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export function PageLayout({ children, title }: PageLayoutProps) {
  return (
    <div className="app-page flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-6 sm:px-6 sm:py-10">
        {title && (
          <h1 className="mb-8 text-center text-xl font-semibold text-zinc-900 sm:mb-10 sm:text-2xl">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
