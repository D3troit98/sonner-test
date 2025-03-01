import { useState } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const PasswordSetting = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    if (!password) {
      // First toast call
      console.log("Calling error toast for the first time");
      toast.error('Password is required');
      // Multiple calls to demonstrate the issue
      return;
    }

    setLoading(true);

    console.log("Calling success toast for the first time");
    toast.success('Password updated successfully');
    // Simulate API call
    setLoading(false);
    setPassword('');
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm max-w-md mx-auto my-8">
      <h2 className="text-xl font-bold mb-4">Password Setting Component</h2>

      <div className="flex flex-col items-start gap-y-2 w-full">
        <span className="font-medium text-gray-700">Password</span>
        <div className="relative w-full">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-3 outline-none rounded border border-gray-300"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-4 flex items-center text-gray-700"
            onClick={togglePasswordVisibility}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button
        disabled={loading}
        onClick={handleSubmit}
        className="mt-4 px-6 py-2.5 w-full bg-green-600 text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'Updating...' : 'Update Password'}
      </button>

      <div className="mt-4 text-sm text-gray-500">
        Try submitting with empty password to see error toast
        <br />
        <strong>Expected:</strong> Single error toast should appear
        <br />
        <strong>Actual:</strong> Toast only appears after multiple calls
      </div>
    </div>
  );
};

export default PasswordSetting;
