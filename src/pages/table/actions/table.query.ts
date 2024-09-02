import {useQuery} from 'react-query';
import {getPostsService} from './table.service';

export const usePosts = ()=>{
    return useQuery<any[], Error>('test', () => {
        return getPostsService();
    });
};
