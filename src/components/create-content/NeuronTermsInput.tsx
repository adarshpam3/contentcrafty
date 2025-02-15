
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NeuronTextArea } from "./NeuronTextArea";
import { AlertCircle } from "lucide-react";

interface NeuronTermsInputProps {
  jsonTerms: string;
  onJsonTermsChange: (value: string) => void;
  onParseScript: () => void;
}

export function NeuronTermsInput({ 
  jsonTerms, 
  onJsonTermsChange, 
  onParseScript 
}: NeuronTermsInputProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">NeuronWriter terms</h2>
      <p className="text-gray-600 mb-4">
        Provide the JSON script copied from the NeuronWriter tool. You can find more information in{" "}
        <a href="#" className="text-[#06962c] hover:text-[#057a24]">our guide</a>.
      </p>

      <div className="bg-[#e6f4ea] border border-[#b8e6c4] rounded-lg p-4 mb-6">
        <p className="text-[#06962c] flex items-center gap-2">
          To use this model, you need to have an active account in the{" "}
          <a 
            href="https://neuronwriter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#06962c] hover:text-[#057a24]"
          >
            NeuronWriter
          </a>
          {" "}application.
          <Button 
            variant="secondary"
            className="bg-[#06962c] text-white hover:bg-[#057a24] ml-auto"
            onClick={() => window.open('https://neuronwriter.com', '_blank')}
          >
            Go to Neuron
          </Button>
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">JSON with terms:</label>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#06962c] hover:text-[#057a24] flex items-center gap-1"
          >
            <AlertCircle className="h-4 w-4" />
            How to get JSON?
          </Button>
        </div>

        <NeuronTextArea
          value={jsonTerms}
          onChange={(e) => onJsonTermsChange(e.target.value)}
          placeholder="Paste your JSON content here..."
        />

        <Button
          onClick={onParseScript}
          className="w-full bg-[#b8e6c4] text-[#06962c] hover:bg-[#a5d4b1]"
        >
          Parse Script
        </Button>
      </div>
    </Card>
  );
}
