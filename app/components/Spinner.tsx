import { Loader2Icon } from 'lucide-react';

export default function Spinner() {
  return (
    <div className='flex w-full justify-center'>
      <Loader2Icon className="animate-spin " size={50}/>{" "}
    </div>
  );
}
