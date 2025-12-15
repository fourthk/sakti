import { LucideIcon } from "lucide-react";

interface AssetCardProps {
  icon: LucideIcon;
  count: number;
  label: string;
  iconColor: string;
}

const AssetCard = ({ icon: Icon, count, label, iconColor }: AssetCardProps) => {
  return (
    <div 
      className="rounded-lg p-6 flex items-center gap-4 shadow-sm transition-all hover:shadow-md"
      style={{
        backgroundColor: "#FDFDFD",
        border: "1px solid #384E66",
      }}
    >
      <div 
        className="p-3 rounded-lg"
        style={{ backgroundColor: iconColor + "20" }}
      >
        <Icon size={32} style={{ color: iconColor }} />
      </div>
      <div>
        <div className="text-4xl font-bold" style={{ color: "#384E66" }}>
          {count}
        </div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  );
};

export default AssetCard;
