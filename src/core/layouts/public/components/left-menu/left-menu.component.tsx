import {memo} from 'react';
import LeftMenuItemComponent from '../left-menu-item/left-menu-item.component';
import {generateGuid} from 'core/helpers/generate-guid';
import {AnnouncementIcon, DocsIcon, HomeIcon, PollIcon, SettingIcon} from 'assets/images/icons/left-menu';
import {Routes} from 'router/routes';
import {useLeftMenuStyles} from './left-menu.style';
import classNames from 'classnames';
import useLocalization from 'assets/lang';

const LeftMenuComponent = memo(({isOpen}: { isOpen: boolean }) => {
    const classes = useLeftMenuStyles();

    const translate = useLocalization();

    const items = [
        {
            id: 1,
            name: translate('home_title'),
            link: Routes.home,
            icon: <HomeIcon/>,
          
        },
        {
            id: 2,
            name: translate('announcement_title'),
            link: Routes.announcement,
            icon: <AnnouncementIcon/>,
        }, {
            id: 3,
            name: translate('quiz_title'),
            link: Routes.quiz,
           
            icon: <DocsIcon/>,
        },
        {
            id: 4,
            name: translate('poll_title'),
            link: Routes.poll,
            icon: <PollIcon/>,
        },
        {
            id: 5,
            name: translate('setting_title'),
            link: Routes.setting,
            icon: <SettingIcon/>,
        }
    ];

    const leftMenuClasses = classNames({
        [classes.leftMenu]: true,
        [classes.hide]: !isOpen,
    });

    return (
        <div className={leftMenuClasses}>
            <ul>
                {
                    items.map((i: any) => (
                        <LeftMenuItemComponent
                            key={generateGuid()}
                            name={i.name}
                            link={i.link}
                            icon={i.icon}
                            submenu={i.submenu}
                        />
                    ))
                }
            </ul>
        </div>
    );
});


export default LeftMenuComponent;
