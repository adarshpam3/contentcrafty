import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function UploadCSVTab() {
  return (
    <div className="space-y-4">
      <p className="text-gray-500 mb-4">
        Upload your Articles from CSV file.
      </p>
      <div className="flex items-center gap-4">
        <Button 
          variant="secondary" 
          className="flex items-center gap-2"
          onClick={() => document.getElementById('csv-upload')?.click()}
        >
          <Upload className="w-4 h-4" />
          Upload CSV
        </Button>
        <span className="text-gray-500">select file</span>
        <input 
          id="csv-upload"
          type="file" 
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            console.log(e.target.files?.[0]);
          }}
        />
      </div>
      <a href="#" className="text-purple-600 hover:underline text-sm block">
        CSV example
      </a>
      <div className="bg-purple-50 p-4 rounded-lg mt-4">
        <p className="text-purple-600 font-medium">Important:</p>
        <p className="text-purple-600">
          titles can not contain comma like: 'Small Changes, Big Results: 5 Tips For...'
        </p>
      </div>
    </div>
  );
}