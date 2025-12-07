import React from "react";
import AppLayout from "../../layouts/AppLayout";
import PageHeader from "../../components/ui/PageHeader";



export default function Settings() {

    return (
        <AppLayout>
        <PageHeader title="Parametre " />
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">Ici, vous pouvez gerer les paramtres.</p>
        </div>
        </AppLayout>
    )

}



