
import {LogoutIcon} from 'assets/images/icons/logout';
import {useHeaderRightStyles} from './header-right.style';
import { Routes } from 'router/routes';
import { useNavigate } from 'react-router-dom';

const HeaderRightComponent = () => {
    const classes = useHeaderRightStyles();
    const navigate=useNavigate();

    const logout = () => {
      localStorage.clear();
      navigate(Routes.login);
    };

    return (
        <ul className={classes.items}>
            <li className={classes.avatar}>
                
            </li>
            <li className={classes.logout} onClick={logout}>
                <LogoutIcon/>
            </li>
        </ul>
    );
};

export default HeaderRightComponent;
