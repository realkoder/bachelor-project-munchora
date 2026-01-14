import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import useGroceryLists from "~/hooks/useGrocerylist";

export const NewGroceryList = () => {
  const { createNewList } = useGroceryLists();
  const [newListName, setNewListName] = useState("");

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Grocery Lists</h1>
        <p className="text-gray-600 mb-4">Organize your shopping and share with others</p>
      </div>

      {/* Create New List */}
      <div className="flex items-center space-x-2">
        <Input placeholder="New list name" value={newListName} onChange={(e) => setNewListName(e.target.value)} className="w-48" />
        <Button
          onClick={() => {
            createNewList(newListName);
            setNewListName("");
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create List
        </Button>
      </div>
    </div>
  );
};
