import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import ChartCard from "@/components/ChartCard";
import CollapsibleSection from "@/components/CollapsibleSection";
import AssetCard from "@/components/AssetCard";
import {
  Server,
  Network,
  HardDrive,
  Database,
  Monitor,
  Smartphone,
  Phone,
  Tablet,
  Printer,
  Shield,
  Truck,
  Laptop,
  FileCode,
  Globe,
  Lock,
  Wrench,
  FileText,
  Users,
  Cloud,
  Building,
  Zap,
  Wind,
} from "lucide-react";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const pieData = {
    labels: ['Need Checking', 'Need Review', 'Accepted'],
    datasets: [
      {
        data: [35, 30, 35],
        backgroundColor: ['#384E66', '#4A6382', '#8FA5C1'],
        borderColor: ['#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    datasets: [
      {
        label: 'Changes',
        data: [3, 4, 5, 4, 6, 5, 6],
        backgroundColor: '#384E66',
        borderRadius: 4,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 8,
      },
    },
  };

  return (
    <div>
      <h1 
        className="text-5xl font-bold mb-8"
        style={{ color: "#253040" }}
      >
        Dashboard
      </h1>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Statistika" description="Laporan yang diterima">
          <Pie data={pieData} options={pieOptions} />
        </ChartCard>
        
        <ChartCard title="Statistika" description="Perubahan yang telah dilakukan">
          <Bar data={barData} options={barOptions} />
        </ChartCard>
      </div>

      {/* Asset Categories */}
      <CollapsibleSection title="Infrastructure" defaultOpen={true}>
        <AssetCard icon={Server} count={11} label="Rack" iconColor="#3B82F6" />
        <AssetCard icon={Server} count={16} label="Server" iconColor="#8B5CF6" />
        <AssetCard icon={Network} count={11} label="Network Device" iconColor="#EC4899" />
        <AssetCard icon={HardDrive} count={11} label="Storage System" iconColor="#F59E0B" />
      </CollapsibleSection>

      <CollapsibleSection title="Virtualization">
        <AssetCard icon={Database} count={11} label="Hypervisor" iconColor="#10B981" />
        <AssetCard icon={Monitor} count={16} label="Virtual Machine" iconColor="#6366F1" />
      </CollapsibleSection>

      <CollapsibleSection title="End User Devices">
        <AssetCard icon={Laptop} count={11} label="PC/Workstation" iconColor="#3B82F6" />
        <AssetCard icon={Phone} count={11} label="Phone" iconColor="#EF4444" />
        <AssetCard icon={Smartphone} count={16} label="IP Phone" iconColor="#8B5CF6" />
        <AssetCard icon={Smartphone} count={11} label="Mobile Phone" iconColor="#06B6D4" />
        <AssetCard icon={Tablet} count={11} label="Tablet" iconColor="#F59E0B" />
        <AssetCard icon={Printer} count={11} label="Printer" iconColor="#14B8A6" />
      </CollapsibleSection>

      <CollapsibleSection title="Non-TI Supporting Assets">
        <AssetCard icon={Shield} count={11} label="Physical Security" iconColor="#DC2626" />
        <AssetCard icon={Truck} count={11} label="Transport/Logistics" iconColor="#059669" />
      </CollapsibleSection>

      <CollapsibleSection title="Software & Logical CI">
        <AssetCard icon={FileCode} count={11} label="Operating System" iconColor="#3B82F6" />
        <AssetCard icon={Database} count={11} label="Database" iconColor="#8B5CF6" />
        <AssetCard icon={Server} count={11} label="Application/Middleware" iconColor="#EC4899" />
        <AssetCard icon={Laptop} count={11} label="Business Application" iconColor="#F59E0B" />
        <AssetCard icon={HardDrive} count={11} label="Backup & Monitoring Tools" iconColor="#10B981" />
      </CollapsibleSection>

      <CollapsibleSection title="Network & Connectivity">
        <AssetCard icon={Globe} count={11} label="WAN Device" iconColor="#3B82F6" />
        <AssetCard icon={Network} count={11} label="LAN Device" iconColor="#10B981" />
        <AssetCard icon={Shield} count={11} label="Firewall" iconColor="#EF4444" />
        <AssetCard icon={Lock} count={11} label="VPN Gateway" iconColor="#8B5CF6" />
        <AssetCard icon={Network} count={11} label="Wireless Infrastructure" iconColor="#06B6D4" />
        <AssetCard icon={Network} count={11} label="Cabling" iconColor="#64748B" />
      </CollapsibleSection>

      <CollapsibleSection title="Security">
        <AssetCard icon={Lock} count={11} label="Identity & Access Management" iconColor="#EF4444" />
        <AssetCard icon={Shield} count={11} label="Endpoint Security" iconColor="#DC2626" />
        <AssetCard icon={Shield} count={11} label="SIEM" iconColor="#991B1B" />
        <AssetCard icon={Lock} count={11} label="Security Appliance" iconColor="#7C2D12" />
      </CollapsibleSection>

      <CollapsibleSection title="Services">
        <AssetCard icon={Wrench} count={11} label="Business Service" iconColor="#3B82F6" />
        <AssetCard icon={Server} count={11} label="IT Service" iconColor="#8B5CF6" />
        <AssetCard icon={HardDrive} count={11} label="Backup & Recovery" iconColor="#10B981" />
        <AssetCard icon={Monitor} count={11} label="Monitoring & Logging" iconColor="#F59E0B" />
      </CollapsibleSection>

      <CollapsibleSection title="Documentation & Knowledge">
        <AssetCard icon={FileText} count={11} label="Policy & SOP" iconColor="#3B82F6" />
        <AssetCard icon={FileCode} count={11} label="Configuration File" iconColor="#8B5CF6" />
        <AssetCard icon={FileText} count={11} label="Contracts & SLA" iconColor="#EC4899" />
        <AssetCard icon={FileText} count={11} label="Knowledge Base" iconColor="#F59E0B" />
      </CollapsibleSection>

      <CollapsibleSection title="People & Organization">
        <AssetCard icon={Users} count={11} label="User/End User" iconColor="#3B82F6" />
        <AssetCard icon={Users} count={11} label="IT Staff" iconColor="#8B5CF6" />
        <AssetCard icon={Users} count={11} label="Vendor/3rd Party" iconColor="#EC4899" />
        <AssetCard icon={Users} count={11} label="Business Owner" iconColor="#F59E0B" />
        <AssetCard icon={Users} count={11} label="Change Advisory Board (CAB)" iconColor="#10B981" />
      </CollapsibleSection>

      <CollapsibleSection title="Cloud & External Service">
        <AssetCard icon={Cloud} count={11} label="Cloud Provider" iconColor="#3B82F6" />
        <AssetCard icon={Cloud} count={11} label="Cloud Services" iconColor="#06B6D4" />
        <AssetCard icon={Globe} count={11} label="SaaS Applications" iconColor="#8B5CF6" />
        <AssetCard icon={Server} count={11} label="Hosting & Domain" iconColor="#10B981" />
      </CollapsibleSection>

      <CollapsibleSection title="Environment & Facility">
        <AssetCard icon={Building} count={11} label="Building" iconColor="#64748B" />
        <AssetCard icon={Building} count={11} label="Room" iconColor="#475569" />
        <AssetCard icon={Building} count={11} label="Facility" iconColor="#334155" />
        <AssetCard icon={Zap} count={11} label="Power Supply" iconColor="#F59E0B" />
        <AssetCard icon={Wind} count={11} label="Cooling System" iconColor="#06B6D4" />
      </CollapsibleSection>
    </div>
  );
};

export default Dashboard;
