// components/ui/EmptyState.jsx
export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}) {
  return (
    <div className="text-center py-12">
      {Icon && (
        <Icon className="mx-auto mb-4 text-gray-400" size={48} />
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  )
}