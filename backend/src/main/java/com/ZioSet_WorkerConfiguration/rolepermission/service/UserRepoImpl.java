package com.ZioSet_WorkerConfiguration.rolepermission.service;

import com.ZioSet_WorkerConfiguration.dto.ColumnSearch;
import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.UserInfo;
import com.ZioSet_WorkerConfiguration.rolepermission.repository.UserCustomRepo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class UserRepoImpl implements UserCustomRepo {
    @PersistenceContext
    EntityManager entityManager;

    public List<UserInfo> getUserByLimit(int page_no, int item_per_page) {
        try {
            long result = 0L;
            Query q = null;
            result = ((Long) this.entityManager.createQuery("SELECT count(u) FROM UserInfo u").getSingleResult()).longValue();
            TypedQuery typedQuery = this.entityManager.createQuery("from UserInfo  ", UserInfo.class);
            System.out.println("COUNT " + result);

            int first = (page_no - 1) * item_per_page;

            typedQuery.setFirstResult(first);
            typedQuery.setMaxResults(item_per_page);
            System.out.println("first " + first);
            System.out.println("item_per_page " + item_per_page);
            List<UserInfo> list = typedQuery.getResultList();
            System.out.println("list " + list.size());
            return list;
        } finally {
            this.entityManager.close();
        }
    }

    public List<UserInfo> getUserByLimitAndSearch(String searchText, int pageNo, int perPage) {
        try {
            int maxResult;
            Query q = null;
            long result = ((Long) this.entityManager
                    .createQuery("SELECT count(u) FROM UserInfo u where  u.username LIKE :searchText OR  u.firstName LIKE :searchText OR u.lastName LIKE :searchText ")

                    .setParameter("searchText", "%" + searchText + "%").getSingleResult()).longValue();
            TypedQuery typedQuery = this.entityManager.createQuery("from UserInfo u where  u.username LIKE :searchText OR  u.firstName LIKE :searchText OR u.lastName LIKE :searchText ", UserInfo.class);
            int total_count = (int) result;
            int firstR = total_count - pageNo * perPage;
            int maxR = total_count - (pageNo - 1) * perPage;
            if (firstR < 0)
                firstR = 0;
            if (maxR < 10) {
                maxResult = maxR;
            } else {
                maxResult = perPage;
            }
            typedQuery.setMaxResults(maxResult);
            typedQuery.setParameter("searchText", "%" + searchText + "%");
            typedQuery.setFirstResult(firstR);
            typedQuery.setMaxResults(maxResult);
            List<UserInfo> list = typedQuery.getResultList();
            return list;
        } finally {
            this.entityManager.close();
        }
    }

    public int getUserCountAndSearch(String searchText) {
        long result = ((Long) this.entityManager
                .createQuery("SELECT count(u) FROM UserInfo u where  u.username LIKE :searchText OR  u.firstName LIKE :searchText OR u.lastName LIKE :searchText ")

                .setParameter("searchText", "%" + searchText + "%").getSingleResult()).longValue();
        int total_count = (int) result;
        return total_count;
    }

    public int getUserCount() {
        long result = ((Long) this.entityManager.createQuery("SELECT count(u) FROM UserInfo u").getSingleResult()).longValue();
        int total_count = (int) result;
        return total_count;
    }

    public List<UserInfo> getUserBySpecificSearch(String searchText, String columns, int pageNo, int perPage) {
        try {
            int maxResult;
            Query q = null;
            long result = ((Long) this.entityManager
                    .createQuery("SELECT count(u) FROM UserInfo u where  u." + columns + " LIKE :searchText ")

                    .setParameter("searchText", "%" + searchText + "%").getSingleResult()).longValue();
            TypedQuery typedQuery = this.entityManager.createQuery("from UserInfo u where  u." + columns + " LIKE :searchText ", UserInfo.class);
            int total_count = (int) result;
            int firstR = total_count - pageNo * perPage;
            int maxR = total_count - (pageNo - 1) * perPage;
            if (firstR < 0)
                firstR = 0;
            if (maxR < 10) {
                maxResult = maxR;
            } else {
                maxResult = perPage;
            }
            typedQuery.setMaxResults(maxResult);
            typedQuery.setParameter("searchText", "%" + searchText + "%");
            typedQuery.setFirstResult(firstR);
            typedQuery.setMaxResults(maxResult);
            List<UserInfo> list = typedQuery.getResultList();
            return list;
        } finally {
            this.entityManager.close();
        }
    }

    public int getUserCountBySpecificSearch(String searchText, String columns) {
        long result = ((Long) this.entityManager
                .createQuery("SELECT count(u) FROM UserInfo u where  u." + columns + " LIKE :searchText ")

                .setParameter("searchText", "%" + searchText + "%").getSingleResult()).longValue();
        return (int) result;
    }

    public List<UserInfo> getUserInfoByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO) {
        try {
            int pageNo = groupSearchDTO.getPageNo();
            int perPage = groupSearchDTO.getPerPage();
            Query q = null;
            String queryStr = "from UserInfo a where ";
            int i = 0;
            for (ColumnSearch columnSearch : groupSearchDTO.getColumns()) {
                if (columnSearch.getValue() != "" || !columnSearch.getValue().equalsIgnoreCase(""))
                    if (i == 0) {
                        queryStr = queryStr + " a." + columnSearch.getColumnName() + " LIKE : searchText" + i;
                    } else {
                        queryStr = queryStr + " AND a." + columnSearch.getColumnName() + " LIKE : searchText" + i;
                    }
                i++;
            }
            System.out.println("QUERY STRING " + queryStr);
            TypedQuery typedQuery = this.entityManager.createQuery(queryStr, UserInfo.class);
            int j = 0;
            for (ColumnSearch columnSearch : groupSearchDTO.getColumns()) {
                if (columnSearch.getValue() != "" || !columnSearch.getValue().equalsIgnoreCase("")) {
                    System.out.println("Column  " + columnSearch.getColumnName());
                    System.out.println("Value  " + columnSearch.getValue());
                    typedQuery.setParameter("searchText" + j, "%" + columnSearch.getValue() + "%");
                }
                j++;
            }
            int total_count = typedQuery.getResultList().size();
            System.out.println("total_count " + total_count);
            int first = (pageNo - 1) * perPage;
            typedQuery.setMaxResults(perPage);
            typedQuery.setFirstResult(first);
            typedQuery.setMaxResults(perPage);
            List<UserInfo> list = typedQuery.getResultList();
            System.out.println("Value  " + list.size());
            return list;
        } finally {
            this.entityManager.close();
        }
    }

    public int getUserInfoCountByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO) {
        int pageNo = groupSearchDTO.getPageNo();
        int perPage = groupSearchDTO.getPerPage();
        Query q = null;
        String queryStr = "from UserInfo a where ";
        int i = 0;
        for (ColumnSearch columnSearch : groupSearchDTO.getColumns()) {
            if (columnSearch.getValue() != "" || !columnSearch.getValue().equalsIgnoreCase(""))
                if (i == 0) {
                    queryStr = queryStr + " a." + columnSearch.getColumnName() + " LIKE : searchText" + i;
                } else {
                    queryStr = queryStr + " AND a." + columnSearch.getColumnName() + " LIKE : searchText" + i;
                }
            i++;
        }
        System.out.println("QUERY STRING " + queryStr);
        TypedQuery typedQuery = this.entityManager.createQuery(queryStr, UserInfo.class);
        int j = 0;
        for (ColumnSearch columnSearch : groupSearchDTO.getColumns()) {
            if (columnSearch.getValue() != "" || !columnSearch.getValue().equalsIgnoreCase("")) {
                System.out.println("Column  " + columnSearch.getColumnName());
                System.out.println("Value  " + columnSearch.getValue());
                typedQuery.setParameter("searchText" + j, "%" + columnSearch.getValue() + "%");
            }
            j++;
        }
        int total_count = typedQuery.getResultList().size();
        return total_count;
    }
}