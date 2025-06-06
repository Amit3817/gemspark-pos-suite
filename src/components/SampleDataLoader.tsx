
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabaseApi } from "@/services/supabaseApi";
import { useAppContext } from "@/contexts/AppContext";

export default function SampleDataLoader() {
  const { toast } = useToast();
  const { refreshData } = useAppContext();

  const loadSampleData = async () => {
    try {
      toast({
        title: "Loading Sample Data",
        description: "Adding sample products, customers, and bills...",
      });

      // Sample products (removed rate_per_g)
      const sampleProducts = [
        {
          "Product ID": "P001",
          "Product Name": "Gold Ring",
          "Category": "Rings",
          "Carat": "22K",
          "Weight (g)": 10,
          "Quantity": 5,
          "Metal Type": "Gold",
          "Notes": "Classic Design"
        },
        {
          "Product ID": "P002",
          "Product Name": "Diamond Necklace",
          "Category": "Necklaces",
          "Carat": "18K",
          "Weight (g)": 25,
          "Quantity": 3,
          "Metal Type": "Gold",
          "Notes": "Premium Collection"
        },
        {
          "Product ID": "P003",
          "Product Name": "Silver Earrings",
          "Category": "Earrings",
          "Carat": "92.5",
          "Weight (g)": 8,
          "Quantity": 10,
          "Metal Type": "Silver",
          "Notes": "Handcrafted"
        }
      ];

      // Sample customers
      const sampleCustomers = [
        {
          "Customer ID": "C001",
          "Name": "Amit Verma",
          "Phone": "9876543210",
          "Email": "amit.verma@example.com",
          "Status": "VIP",
          "Total Purchases": 125000,
          "Last Visit": "2024-01-15"
        },
        {
          "Customer ID": "C002",
          "Name": "Priya Sharma",
          "Phone": "9876543211",
          "Email": "priya.sharma@example.com",
          "Status": "Regular",
          "Total Purchases": 45000,
          "Last Visit": "2024-01-10"
        },
        {
          "Customer ID": "C003",
          "Name": "Raj Patel",
          "Phone": "9876543212",
          "Email": "raj.patel@example.com",
          "Status": "New",
          "Total Purchases": 0,
          "Last Visit": "2024-01-20"
        }
      ];

      // Add products
      for (const product of sampleProducts) {
        await supabaseApi.addProduct(product);
      }

      // Add customers
      for (const customer of sampleCustomers) {
        await supabaseApi.addCustomer(customer);
      }

      // Sample bill (updated with new required fields)
      await supabaseApi.addBill({
        "Bill No": "B001",
        "Customer Name": "Amit Verma",
        "Phone Number": "9876543210",
        "Product ID": "P001",
        "Product Name": "Gold Ring",
        "Metal Type": "Gold",
        "Carat": "22K",
        "Weight (g)": 10,
        "Rate per g": 5200,
        "Making Charges": 500,
        "Making Charges Percent": 10,
        "GST (%)": 3,
        "Gold Price per 10g": 52000,
        "Silver Price per 10g": 0
      });

      // Refresh data to show new items
      await refreshData();

      toast({
        title: "Success",
        description: "Sample data loaded successfully!",
      });
    } catch (error) {
      console.error('Error loading sample data:', error);
      toast({
        title: "Error",
        description: "Failed to load sample data",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={loadSampleData} variant="outline" className="mb-4">
      Load Sample Data
    </Button>
  );
}
