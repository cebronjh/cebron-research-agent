import * as React from "react"

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, value, onValueChange, ...props }, ref) => {
    // Collect SelectItem values and labels from children tree
    const items: { value: string; label: React.ReactNode }[] = [];
    const extractItems = (children: React.ReactNode) => {
      React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) return;
        if (child.type === SelectItem || (child.type as any)?.displayName === "SelectItem") {
          items.push({ value: child.props.value, label: child.props.children });
        } else if (child.props?.children) {
          extractItems(child.props.children);
        }
      });
    };
    extractItems(children);

    return (
      <select
        className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
        ref={ref}
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        {...props}
      >
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    )
  }
)
Select.displayName = "Select"

// These are no-op wrappers — Select extracts items directly from the children tree
const SelectTrigger = ({ children }: { children?: React.ReactNode; id?: string; className?: string }) => <>{children}</>
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = (_props: { placeholder?: string; className?: string; children?: React.ReactNode }) => null
SelectValue.displayName = "SelectValue"

const SelectContent = ({ children }: { children?: React.ReactNode; className?: string }) => <>{children}</>
SelectContent.displayName = "SelectContent"

interface SelectItemProps {
  value: string;
  children?: React.ReactNode;
  className?: string;
}

const SelectItem = (_props: SelectItemProps) => null
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
