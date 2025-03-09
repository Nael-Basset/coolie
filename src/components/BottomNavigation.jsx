import { useNavigate } from 'react-router-dom'
import { FaHome, FaBook, FaShoppingBasket, FaMapMarkerAlt, FaStar, FaUser, FaHeart } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext'

const BottomNavigation = ({ active, setActive }) => {
  const navigate = useNavigate()
  const { getCartCount } = useCart()
  
  const navigateTo = (page, path) => {
    setActive(page)
    navigate(path)
  }
  
  const cartItemsCount = getCartCount()
  
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background bg-opacity-95 border-t border-gray-200">
      <div className="flex justify-around py-3">
        <NavItem 
          icon={<FaHome size={22} />}
          isActive={active === 'home'}
          onClick={() => navigateTo('home', '/')}
        />
        <NavItem 
          icon={<FaBook size={22} />}
          isActive={active === 'recipes'}
          onClick={() => navigateTo('recipes', '/recipes')}
        />
        <NavItem 
          icon={<FaShoppingBasket size={22} />}
          isActive={active === 'shop'}
          onClick={() => navigateTo('shop', '/shop')}
          badge={cartItemsCount > 0 ? cartItemsCount : null}
        />
        <NavItem 
          icon={<FaMapMarkerAlt size={22} />}
          isActive={active === 'map'}
          onClick={() => navigateTo('map', '/map')}
        />
        <NavItem 
          icon={<FaHeart size={22} />}
          isActive={active === 'favorites'}
          onClick={() => navigateTo('favorites', '/favorites')}
        />
        <NavItem 
          icon={<FaUser size={22} />}
          isActive={active === 'profile'}
          onClick={() => navigateTo('profile', '/profile')}
        />
      </div>
    </div>
  )
}

const NavItem = ({ icon, isActive, onClick, badge = null }) => {
  return (
    <button 
      className="flex items-center justify-center p-2 relative"
      onClick={onClick}
    >
      <div className={`${isActive ? 'text-green-primary' : 'text-text-light'}`}>
        {icon}
      </div>
      
      {badge !== null && (
        <span className="absolute top-0 right-0 bg-orange-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  )
}

export default BottomNavigation
