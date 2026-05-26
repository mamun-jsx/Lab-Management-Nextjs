"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Format date to uppercase standard (e.g. 01-MAR-2026)
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Format date for GS1 data matrix text (YYMMDD)
const formatGS1Date = (dateString: string) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  const yy = d.getFullYear().toString().slice(-2);
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  return `${yy}${mm}${dd}`;
};

export default function PrintLabelPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-items/${id}`, { headers })
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            setData(result.data);
          }
        })
        .catch((err) => console.error("Error fetching data:", err));
    }
  }, [id]);

  if (!data) return <div className="p-10 font-bold">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 py-10 print:bg-white print:py-0">
      {/* Visual Button for printing */}
      <div className="mb-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow-lg font-bold hover:bg-blue-700"
        >
          Click to Print Label (74mm x 105mm)
        </button>
      </div>

      {/* The Printable Label Container */}
      {/* 74mm = 279.6px, 105mm = 396.8px (approx at 96 DPI). Let's use exact CSS dimensions */}
      <div
        className="bg-white border border-black relative overflow-hidden"
        style={{
          width: "74mm",
          height: "105mm",
          padding: "3mm",
          boxSizing: "border-box",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Top Header Boxes */}
        <div className="flex justify-between w-full h-[22mm] mb-1">
          {/* Left Box */}
          <div className="border border-black w-[48%] h-full p-1 text-[2.5mm] leading-tight overflow-hidden">
            <div className="font-bold mb-1">
              JMI Syringe & Medical Devices Ltd.
            </div>
            <div>117, Unique Heights, Kazi Nazrul Islam Avenue, Ramana,</div>
            <div>Dhaka-1217.</div>
          </div>
          {/* Right Box */}
          <div className="border border-black w-[48%] h-full p-1 text-[2.5mm] leading-tight overflow-hidden">
            <div className="font-bold mb-1">
              JMI Syringe & Medical Devices Ltd.
            </div>
            <div>Noapara, Chauddagram, Cumilla,</div>
            <div>Bangladesh.</div>
          </div>
        </div>

        <hr className="border-black mb-1" />

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-y-1 w-full text-[2.8mm] mb-1">
          <div>
            <div className="text-[2mm] text-gray-700 mb-[0.5mm]">SSCC</div>
            <div className="font-bold leading-none">{data.id}</div>
          </div>
          <div className="text-right">
            <div className="text-[2mm] text-gray-700 mb-[0.5mm]">QUANTITY</div>
            <div className="font-bold leading-none">{data.quantity}</div>
          </div>

          <div>
            <div className="text-[2mm] text-gray-700 mb-[0.5mm]">CONTENT</div>
            <div className="font-bold leading-none">{data.contentCode}</div>
          </div>
          <div className="text-right">
            <div className="text-[2mm] text-gray-700 mb-[0.5mm]">EXPIRY</div>
            <div className="font-bold leading-none">
              {formatDate(data.expiryDate)}
            </div>
          </div>

          <div>
            <div className="text-[2mm] text-gray-700 mb-[0.5mm]">BATCH/LOT</div>
            <div className="font-bold leading-none">{data.batchLot}</div>
          </div>
          <div className="text-right">
            <div className="text-[2mm] text-gray-700 mb-[0.5mm]">PROD DATE</div>
            <div className="font-bold leading-none">
              {formatDate(data.prodDate)}
            </div>
          </div>
        </div>

        {/* Full width element */}
        <div className="mb-2 text-[2.8mm]">
          <div className="text-[2mm] text-gray-700 mb-[0.5mm]">
            UNICEF MATERIAL DESCRIPTION
          </div>
          <div className="font-bold leading-tight">
            {data.materialDescription}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-2 w-full text-[2.8mm] mb-1">
          <div>
            <div className="text-[2mm] text-gray-700 mb-[0.5mm]">
              CUST PART NO.
            </div>
            <div className="font-bold leading-none">{data.custPartNo}</div>
          </div>
          <div className="text-right">
            <div className="text-[2mm] text-gray-700 mb-[0.5mm]">
              ORDER NUMBER
            </div>
            <div className="font-bold leading-none">{data.orderNumber}</div>
          </div>
        </div>

        <hr className="border-black mb-2 mt-2" />

        {/* Bottom Barcode Area */}
        <div className="flex flex-row justify-between w-full relative">
          {/* Generated Tag (QR or Datamatrix based on backend) */}
          <div className="w-[30mm] h-[30mm] bg-white border-0 flex items-start justify-start">
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/qr/${data.id}`}
              alt="Barcode"
              className="w-full h-auto object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>

          {/* Texts GS1 */}
          <div className="w-[38mm] text-[2.2mm] flex flex-col justify-start leading-tight space-y-0.5">
            <div>(00) {data.id} </div>
            <div>(02) {data.contentCode}</div>
            <div>(10) {data.batchLot}</div>
            <div>(17) {formatGS1Date(data.expiryDate)}</div>
            <div>(11) {formatGS1Date(data.prodDate)}</div>
            <div>(37) {data.quantity}</div>
            <div>(241) {data.custPartNo}</div>
            <div>(400) {data.orderNumber}</div>
          </div>

          <div className="absolute bottom-[-1mm] right-0 font-bold text-[2.5mm]">
            CASE 1 / {data.quantity}
          </div>
        </div>
      </div>

      {/* Global Print Styles inside custom style block to strict page dimension */}
      {/* Added global styles specifically for printing securely without margins */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            background: #fff !important;
          }
          
          /* Hide Next.js dev overlays during printing if any */
          #nextjs-dev-overlay {
             display: none !important;
          }

          /* Force page dimensions */
          @page {
            size: 74mm 105mm;
            margin: 0mm;
          }
        }
      `,
        }}
      />
    </div>
  );
}
