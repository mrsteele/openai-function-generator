import './globals.css'
import App from "../components/App";

export const metadata = {
  title: 'OpenAI Function Schema Generator | Build Accurate AI Function Schemas',
  description:
    'Generate precise and efficient schemas for OpenAI functions effortlessly. Our tool helps developers design AI function schemas for better integrations and accuracy.',
  keywords: [
    'OpenAI function schema generator',
    'AI schema tool',
    'OpenAI integration',
    'function schema builder',
    'AI function design',
  ],
  authors: [{ name: 'Your Name or Company' }],
  viewport: 'width=device-width, initial-scale=1.0',
  openGraph: {
    title: 'OpenAI Function Schema Generator | Build Accurate AI Function Schemas',
    description:
      'Quickly create and optimize schemas for OpenAI functions with our powerful tool. Perfect for developers and AI enthusiasts.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenAI Function Schema Generator',
    description:
      'Generate schemas for OpenAI functions easily with our intuitive tool. Optimize AI integrations now.',
  }
};

export default function Page () {
  return (
    <App />
  )
}


