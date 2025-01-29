import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const languages = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian",
  "Chinese", "Japanese", "Korean", "Arabic", "Hindi", "Bengali", "Dutch",
  "Greek", "Polish", "Turkish", "Vietnamese", "Thai", "Indonesian"
];

interface LanguageSelectionProps {
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
}

export function LanguageSelection({ selectedLanguage, setSelectedLanguage }: LanguageSelectionProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-2">Select language</h2>
      <p className="text-gray-500 mb-6">
        Choose the language in which you want to write your content.
      </p>
      
      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a language..." />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language} value={language.toLowerCase()}>
              {language}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  );
}