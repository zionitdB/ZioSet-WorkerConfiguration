package com.ZioSet_WorkerConfiguration.repo;

import java.util.List;

import com.ZioSet_WorkerConfiguration.dto.ColumnSearch;
import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.StandalonApplication;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;

public class StandalonApplicationCustomeRepoImpl implements StandalonApplicationCustomeRepo {

	
	 @PersistenceContext
	  EntityManager entityManager;
	@Override
	public List<StandalonApplication> getStandalonApplicationByLimit(int pageNo, int perPage) {
		// TODO Auto-generated method stub
		 try {
			 long result = 0L;
	      Query q = null;
	      result = ((Long)this.entityManager
	        .createQuery("SELECT count(*) FROM StandalonApplication a ")
	        
	        .getSingleResult()).longValue();
	      TypedQuery typedQuery = this.entityManager.createQuery("select a from  StandalonApplication a ", StandalonApplication.class);
	      System.out.println("Count  " + result);
	      int first = (pageNo - 1) * perPage;
	      typedQuery.setFirstResult(first);
	      typedQuery.setMaxResults(perPage);
	      List<StandalonApplication> list = typedQuery.getResultList();
	      return list;
	    } finally {
	      this.entityManager.close();
	    } 
	}

	@Override
	public List<StandalonApplication> getAllStandalonApplicationByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO) {
		
		
		 int pageNo = groupSearchDTO.getPageNo();
		    int perPage = groupSearchDTO.getPerPage();
		    Query q = null;
		    String queryStr = "from StandalonApplication a where  ";
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
		    TypedQuery typedQuery = this.entityManager.createQuery(queryStr, StandalonApplication.class);
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
		    System.out.println("QUER  "+typedQuery);
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
		 
		    List<StandalonApplication> list = typedQuery.getResultList();
		    System.out.println("Value  " + list.size());
		    return list;
		// TODO Auto-generated method stub
		
	}

	@Override
	public int getCountAllStandalonApplicationByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO) {
		
		 int pageNo = groupSearchDTO.getPageNo();
		    int perPage = groupSearchDTO.getPerPage();
		    Query q = null;
		    String queryStr = "from StandalonApplication a where  ";
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
		  TypedQuery typedQuery = this.entityManager.createQuery(queryStr, StandalonApplication.class);
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
		// TODO Auto-generated method stub
		return total_count;
	}

}
