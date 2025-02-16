
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProjectDialogsProps {
  projectToDelete: string | null;
  projectToRename: { id: string; name: string } | null;
  newProjectName: string;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  onRenameCancel: () => void;
  onRenameConfirm: () => void;
  onNewNameChange: (name: string) => void;
}

export function ProjectDialogs({
  projectToDelete,
  projectToRename,
  newProjectName,
  onDeleteCancel,
  onDeleteConfirm,
  onRenameCancel,
  onRenameConfirm,
  onNewNameChange,
}: ProjectDialogsProps) {
  return (
    <>
      <AlertDialog open={!!projectToDelete} onOpenChange={() => onDeleteCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog 
        open={!!projectToRename} 
        onOpenChange={(open) => {
          if (!open) onRenameCancel();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Enter a new name for your project below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter new project name"
              value={newProjectName}
              onChange={(e) => onNewNameChange(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onRenameCancel}>
              Cancel
            </Button>
            <Button 
              onClick={onRenameConfirm}
              className="bg-[#06962c] hover:bg-[#057a24] text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
