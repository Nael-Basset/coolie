import { FaCalendarAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const PlanningButton = () => {
  const navigate = useNavigate();
  
  return (
    <button 
      className="bg-background-darker rounded-card shadow-card p-4 h-28 flex items-center justify-start shadow-md"
      onClick={() => navigate('/planning')}
    >
      <FaCalendarAlt className="text-green-primary text-2xl mr-4" />
      <span className="font-header text-green-primary text-lg">Planning</span>
    </button>
  )
}

export default PlanningButton
