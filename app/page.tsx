'use client';

import { useState } from 'react';
import ImageGenerationForm from '@/components/ImageGenerationForm';
import OutputDisplay from '@/components/OutputDisplay';
import ExamplesSection from '@/components/ExamplesSection';
import AdditionalInfo from '@/components/AdditionalInInfo';

interface GeneratedImage {
  filename: string;
  storage_path: string;
  public_url: string;
  width: number;
  height: number;
}

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AI Image Generation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ImageGenerationForm onImageGenerated={setGeneratedImage} />
        <OutputDisplay image={generatedImage} />
      </div>
      <ExamplesSection />
      <AdditionalInfo />
    </div>
  );
}