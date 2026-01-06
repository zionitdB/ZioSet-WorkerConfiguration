package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.dto.ColumnSearch;
import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.Category;
import com.ZioSet_WorkerConfiguration.model.ScriptTargetSystemEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class ScriptTargetSystemCustomRepoImpl implements ScriptTargetSystemCustomRepo{

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public List<ScriptTargetSystemEntity> getScriptTargetSystemByLimit(int pageNo, int perPage) {
        try {
            long result = 0L;
            Query q = null;
            result = ((Long)this.entityManager
                    .createQuery("SELECT count(*) FROM ScriptTargetSystemEntity a ")

                    .getSingleResult()).longValue();
            TypedQuery typedQuery = this.entityManager.createQuery("select a from  ScriptTargetSystemEntity a ", ScriptTargetSystemEntity.class);
            System.out.println("Count  " + result);
            int first = (pageNo - 1) * perPage;
            typedQuery.setFirstResult(first);
            typedQuery.setMaxResults(perPage);
            List<ScriptTargetSystemEntity> list = typedQuery.getResultList();
            return list;
        } finally {
            this.entityManager.close();
        }
    }

    @Override
    public List<ScriptTargetSystemEntity> getAllScriptTargetSystemByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO) {
        int pageNo = groupSearchDTO.getPageNo();
        int perPage = groupSearchDTO.getPerPage();
        Query q = null;
        String queryStr = "from ScriptTargetSystemEntity a where  ";
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
        TypedQuery<ScriptTargetSystemEntity> typedQuery = this.entityManager.createQuery(queryStr, ScriptTargetSystemEntity.class);
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
        System.out.println("QUERY  "+typedQuery);
        System.out.println("total_count  "+total_count);
        /*
         * System.out.println("total_count " + total_count); int first = (pageNo - 1) *
         * perPage; typedQuery.setMaxResults(perPage); typedQuery.setFirstResult(first);
         * typedQuery.setMaxResults(perPage);
         */

        int first = total_count - pageNo * perPage;
        int firstR = first;
        int maxR = firstR + perPage ;
        int maxResult = 0;
        if (firstR < 0) {
            firstR = 0;
            // maxR = 1;
        }
        typedQuery.setFirstResult(firstR);

        if(maxR<perPage) {
            int r=perPage-maxR;
            typedQuery.setMaxResults(perPage-r);
        }else {
            typedQuery.setMaxResults(perPage);
        }

        List<ScriptTargetSystemEntity> list = typedQuery.getResultList();
        System.out.println("Value  " + list.size());
        return list;
    }

    @Override
    public int getCountAllScriptTargetSystemByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO) {
        int pageNo = groupSearchDTO.getPageNo();
        int perPage = groupSearchDTO.getPerPage();
        Query q = null;
        String queryStr = "from ScriptTargetSystemEntity a where  ";
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
        TypedQuery typedQuery = this.entityManager.createQuery(queryStr, ScriptTargetSystemEntity.class);
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
