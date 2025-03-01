import { useState } from 'react';
import { toast } from 'sonner';
import { Copy, CheckCircle } from 'lucide-react';

export const Profile = () => {
  const [copiedKey, setCopiedKey] = useState(false);
  const userId = "user-123456";

  const handleCopyClientId = () => {
    // Copy ID to clipboard
    navigator.clipboard.writeText(userId);
    setCopiedKey(true);

    // First toast call
    console.log("Calling toast for the first time");
    toast.success('ID copied to clipboard', {
      description: userId,
    });


    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm max-w-md mx-auto my-8">
      <h2 className="text-xl font-bold mb-4">Profile Component</h2>

      <div
        onClick={handleCopyClientId}
        className="flex items-center justify-between gap-4 text-sm text-slate-600 cursor-pointer hover:bg-slate-100 rounded p-3 border">
        <div className="flex items-center gap-4">
          <span className="truncate">ID: {userId}</span>
        </div>
        {copiedKey ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-slate-400 hover:text-slate-600" />
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Click on the ID above to copy and trigger toast notifications.
        <br />
        <strong>Expected:</strong> Single toast should appear
        <br />
        <strong>Actual:</strong> Toast only appears after multiple calls
      </div>
    </div>
  );
};

export default Profile;
