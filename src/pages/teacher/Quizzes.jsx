import { useState } from 'react'
import AppLayout from '../../layouts/AppLayout'
import PageHeader from '../../components/ui/PageHeader'


export default function Quizzes() { 

    return (

        <AppLayout>
        <PageHeader title="Quiz existants" />
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">Ici, vous pouvez gérer vos quiz existants.</p>
        </div>

        
        </AppLayout>
       
    )
}



