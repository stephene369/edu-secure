import React from "react";
import AppLayout from "../../layouts/AppLayout";
import PageHeader from "../../components/ui/PageHeader";



export default function Support() {

    return (
        <AppLayout>
        <PageHeader title="Support" />

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">Ici, vous pouvez contacter le support pour toute assistance dont vous pourriez avoir besoin.</p>
        </div>  
        

        </AppLayout>
    )

}