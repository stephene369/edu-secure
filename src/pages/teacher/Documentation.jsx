import React from "react";
import AppLayout from "../../layouts/AppLayout";
import PageHeader from "../../components/ui/PageHeader";



export default function Documentation() {

    return (
        <AppLayout>
        <PageHeader title="Documentation" />
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">Ici, vous pouvez accéder à la documentation pour vous aider à utiliser la plateforme.</p>
        </div>
        </AppLayout>
    )

}