import Image from "next/image";
import { Button, Spinner, Box, Heading } from '@chakra-ui/react';
import { gql, useQuery } from '@apollo/client';

export default function Home() {
  // Example GraphQL query to fetch countries
  const COUNTRIES_QUERY = gql`
    query Countries {
      countries {
        code
        name
        emoji
      }
    }
  `;
  const { data, loading, error } = useQuery(COUNTRIES_QUERY);

  return (
    <Box className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Heading as="h1" size="lg" mb={4}>Welcome to the Leonardo Next.js App</Heading>
        <Button colorScheme="teal" mb={4}>A Chakra UI Button</Button>
        {/* Apollo Client Example: List of Countries */}
        <Box>
          <Heading as="h2" size="md" mb={2}>Countries (from GraphQL API)</Heading>
          {loading && <Spinner />}
          {error && <Box color="red.500">Error loading countries.</Box>}
          {data && (
            <Box as="ul" pl={4} style={{ listStyleType: 'disc' }}>
              {data.countries.slice(0, 10).map((country: any) => (
                <Box as="li" key={country.code} mb={1}>
                  {country.emoji} {country.name} ({country.code})
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </Box>
  );
}
