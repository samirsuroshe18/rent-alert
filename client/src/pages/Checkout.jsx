import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Package2, Loader2 } from "lucide-react";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import smartdwellLogo from "@/assets/smartdwell_logo.png";
import html2pdf from "html2pdf.js";
import { addCheckout } from "@/api/checkoutApi";

function Checkout() {
  const componentRef = useRef();
  const [loading, setLoading] = useState(false);

  const formatDate = (isoDate, separator = " ") => {
    const [year, month, day] = isoDate.split("-");
    return `${day}${separator}${month}${separator}${year}`;
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pin: "",
    amount: "",
    mobile: "",
    description: "Rent paid for the month of June 2024",
  });

  const companyData = {
    name: "Smartdwell Technologies",
    address:
      "B/201, BALARAM HEIGHTS, STAR COLONY, SAGAON, DOMBIVLI EAST 421204",
    email: "rahul@smartdwelliot.in",
    logo: smartdwellLogo,
    note: "Thank you for your business!",
  };

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const issueDateISO = "2024-06-01"; // Example issue date
  const dueDateISO = "2024-06-30"; // Example due date
  const formattedIssueDate = formatDate(issueDateISO, "-");
  const formattedDueDate = formatDate(dueDateISO, "-");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCheckboxChange = (e) => {
    setIsTermsAccepted(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleDownloadPDF();
    setLoading(true);

    if (!isTermsAccepted) {
      alert("Please accept the terms and conditions.");
      return;
    }

    try {
      const response = await addCheckout(formData);
      console.log("Order placed successfully:", response.data);
      alert("Order placed successfully!");
    } catch (error) {
      alert(error.response.data.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    // Get the invoice element using the ref's current property
    const element = componentRef.current;

    if (!element) {
      console.error("Invoice element not found");
      return;
    }

    const options = {
      margin: [0.5, 0.5],
      filename: `invoice-${formData.name}.pdf`, // Fixed template literal syntax
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        logging: false,
        useCORS: true,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
    };

    try {
      await html2pdf().set(options).from(element).save();
    } catch (error) {
      alert("Error generating PDF. Please try again.");
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-900 text-white py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Package2 className="h-6 w-6" />
            <span className="text-lg font-semibold">
              Smartdwell Technologies
            </span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex justify-center items-center py-12 px-6">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <div className="col-span-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  rows={3}
                  placeholder="123 Main St, Anytown USA"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Anytown"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="CA"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="pin">Pincode</Label>
                <Input
                  id="pin"
                  placeholder="400001"
                  value={formData.pin}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  type="number"
                  id="amount"
                  placeholder="&#8377;"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  type="tel"
                  id="mobile"
                  placeholder="1234567890"
                  value={formData.mobile}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4"
                  checked={isTermsAccepted}
                  onChange={handleCheckboxChange}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-500 underline">
                    terms and conditions
                  </Link>
                </Label>
              </div>
              <div className="col-span-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isTermsAccepted}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Invoice */}
      <div ref={componentRef} className="invoice__preview bg-white">
        <header className="text-center border-b pb-4 mb-4">
          <img
            src={companyData.logo}
            alt="Company Logo"
            className="mx-auto mb-2 w-48 h-24 sm:w-32 sm:h-32"
          />
          <h1 className="text-xl sm:text-2xl font-bold">{companyData.name}</h1>
          <p className="text-sm sm:text-base">{companyData.address}</p>
          <p className="text-sm sm:text-base">{companyData.email}</p>
        </header>

        <section className="mb-4">
          <h2 className="text-base sm:text-lg font-semibold">Invoice To:</h2>
          <div className="flex justify-between">
            <p className="text-sm sm:text-base">{formData.name}</p>
            <p className="text-sm sm:text-base">
              Issue Date: {formattedIssueDate}
            </p>
          </div>
          <p className="text-sm sm:text-base">{formData.address}</p>
          <p className="text-sm sm:text-base">{formData.mobile}</p>
        </section>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-200 text-center">
                <th className="border px-2 sm:px-4 py-2">Description</th>
                <th className="border px-2 sm:px-4 py-2">Rate</th>
                <th className="border px-2 sm:px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 sm:px-4 py-2">
                  {formData.description}
                </td>
                <td className="border px-2 sm:px-4 py-2 text-right">
                  {formData.amount}
                </td>
                <td className="border px-2 sm:px-4 py-2 text-right">
                  {formData.amount}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan="2"
                  className="border px-2 sm:px-4 py-2 text-right font-bold"
                >
                  Total
                </td>
                <td className="border px-2 sm:px-4 py-2 text-right font-bold">
                  {formData.amount}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <section className="mt-4">
          <div className="border-t pt-6 pb-6 text-gray-500 text-sm">
            <p>{companyData.note}</p>
          </div>
        </section>
      </div>

      <footer className="bg-gray-900 text-white py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm">
            &copy; 2024 Smartdwell Technologies. All rights reserved.
          </p>
          <nav className="flex items-center gap-4">
            <Link to="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link to="/terms" className="hover:underline">
              Terms
            </Link>
            <Link to="/support" className="hover:underline">
              Support
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default Checkout;
