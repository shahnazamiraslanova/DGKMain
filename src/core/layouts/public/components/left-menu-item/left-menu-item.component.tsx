import {ILeftMenuItemProps} from '../../public';
import {useLeftMenuItemStyles} from './left-menu-item.style';
import {NavLink} from 'react-router-dom';
import {generateGuid} from 'core/helpers/generate-guid';
import {useState} from 'react';
import {ArrowDown, ArrowRight} from 'assets/images/icons/arrows';
import classNames from 'classnames';

const LeftMenuItemComponent = ({name, link, icon, submenu}: ILeftMenuItemProps) => {
    const classes = useLeftMenuItemStyles();
    const [submenuOpen, setSubmenuOpen] = useState(false);

    const leftMenuItemClasses = classNames({
        [classes.link]: true,
        'active': submenuOpen,
    });
    return (
        <li className={classes.item}>
            {
                submenu ?
                    <>
                        <div className={leftMenuItemClasses} onClick={() => setSubmenuOpen(!submenuOpen)}>
                            <div className={classes.itemText}>
                                {icon}
                                <span>{name}</span>
                            </div>
                           
                        </div>
                        {
                            submenuOpen ?
                                <ul className={classes.submenu}>
                                    {
                                        submenu.map((item: any) => {
                                            return (
                                                <li key={generateGuid()}>
                                                    <NavLink to={item.link} className={classes.subLink}>
                                                        {item.icon}
                                                        <span>{item.name}</span>
                                                    </NavLink>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                                :
                                null
                        }
                    </>
                    :
                    <NavLink
                        className={classes.link}
                        to={{pathname: link}}
                    >
                        <div className={classes.itemText}>
                            {icon}
                            <span>{name}</span>
                        </div>
                    </NavLink>
            }

        </li>
    );
};

export default LeftMenuItemComponent;
