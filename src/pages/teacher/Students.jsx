import React from "react";
import AppLayout from "../../layouts/AppLayout";
import PageHeader from "../../components/ui/PageHeader";



export default function Students() {

    return (
        <AppLayout>
        <PageHeader title="Étudiants inscrits" />
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">Ici, vous pouvez voir et gérer les étudiants inscrits à vos cours.</p>
        </div>

        
        </AppLayout>
    )

}



