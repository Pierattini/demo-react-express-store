type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({ children, className = "" }: Props) {
  return (
    <div className={`w-full px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}
