'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface GeneratedImage {
  filename: string;
  storage_path: string;
  public_url: string;
  width: number;
  height: number;
}

interface ImageGenerationFormProps {
  onImageGenerated: (image: GeneratedImage | null) => void;
}

export default function ImageGenerationForm({ onImageGenerated }: ImageGenerationFormProps) {
  const [prompt, setPrompt] = useState('A serene lake surrounded by mountains at night');
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [steps, setSteps] = useState(20);
  const [guidance, setGuidance] = useState(7.5);
  const [seed, setSeed] = useState(42);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onImageGenerated(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          width,
          height,
          steps,
          guidance,
          seed,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        onImageGenerated(data.results[0]);
      } else {
        throw new Error('No image generated');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Input</h2>
      
      <div>
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full"
        />
      </div>

      <div>
        <Label>Width: {width}px</Label>
        <Slider
          min={64}
          max={2048}
          step={64}
          value={[width]}
          onValueChange={(value) => setWidth(value[0])}
        />
      </div>

      <div>
        <Label>Height: {height}px</Label>
        <Slider
          min={64}
          max={2048}
          step={64}
          value={[height]}
          onValueChange={(value) => setHeight(value[0])}
        />
      </div>

      <div>
        <Label>Steps: {steps}</Label>
        <Slider
          min={1}
          max={150}
          value={[steps]}
          onValueChange={(value) => setSteps(value[0])}
        />
      </div>

      <div>
        <Label>Guidance: {guidance}</Label>
        <Slider
          min={1}
          max={30}
          step={0.1}
          value={[guidance]}
          onValueChange={(value) => setGuidance(value[0])}
        />
      </div>

      <div>
        <Label htmlFor="seed">Seed</Label>
        <Input
          id="seed"
          type="number"
          value={seed}
          onChange={(e) => setSeed(parseInt(e.target.value))}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate'}
      </Button>
    </form>
  );
}