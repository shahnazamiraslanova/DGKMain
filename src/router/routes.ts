export enum Routes {
    default = '/',
    auth = '/auth',
    home = '/',
    announcement = '/announcement',
    quiz = '/quiz',
    login = '/auth/login',
    poll='/poll',
    setting='/setting',
    legislation='/legislation'
  
}


export const goTo = (route: string, param: string | number) => {
    return route + '/' + param;
};

export const goToWithQuery = (route: string, param: any) => {
    let path = route + '?';
    if (param)
        for (const key in param) {
            if (path.substr(path.length - 1) !== '?')
                path += '&';
            path += key + '=' + param[`${key}`];
        }
    return path;
};
