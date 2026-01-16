import { useState, useEffect } from "react";
import axios from "axios";

export default function Analytics() {
  const [data, setData] = useState({ total: 0, converted: 0, byStage: {} });

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/leads", { params: { limit: 1000 } }); 
        const leads = res.data.leads;
        const converted = leads.filter((l) => l.stage === "Converted").length;
        const byStage = leads.reduce((acc, l) => {
          acc[l.stage] = (acc[l.stage] || 0) + 1;
          return acc;
        }, {});
        setData({ total: leads.length, converted, byStage });
      } catch (err) {
        console.error(err);
      }
    };
    fetchLeads();
  }, []);

  const stageColors = {
    New: "bg-gray-500",
    Contacted: "bg-yellow-500",
    Qualified: "bg-blue-500",
    Converted: "bg-green-500",
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-3xl mt-6">
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>

      <div className="flex flex-wrap gap-4">

        <div className="flex-1 min-w-[120px] p-4 bg-blue-100 rounded">
          <h3 className="text-gray-700 font-semibold">Total Leads</h3>
          <p className="text-2xl font-bold">{data.total}</p>
        </div>


        {Object.keys(data.byStage).map((stage) => (
          <div
            key={stage}
            className={`flex-1 min-w-[120px] p-4 rounded text-white ${stageColors[stage]}`}
          >
            <h3 className="font-semibold">{stage}</h3>
            <p className="text-2xl font-bold">{data.byStage[stage]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
