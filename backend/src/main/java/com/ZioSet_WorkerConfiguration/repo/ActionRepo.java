package com.ZioSet_WorkerConfiguration.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.Action;
import com.ZioSet_WorkerConfiguration.model.Category;
import org.springframework.data.jpa.repository.Query;

public interface ActionRepo extends JpaRepository<Action, Integer>,ActionCustomeRepo {

    @Query("""
    SELECT c.id, c.categoryname, COUNT(a)
    FROM Action a
    JOIN a.category c
    GROUP BY c.id, c.categoryname
""")
    List<Object[]> countActionsPerCategory();

    @Query("""
    SELECT c.id, c.categoryname, sc.categoryname, COUNT(a)
    FROM Action a
    JOIN a.category c
    JOIN a.subCategory sc
    GROUP BY c.id, c.categoryname, sc.categoryname
""")
    List<Object[]> countActionsPerCategoryAndSubCategory();

}
