package com.example.demo.service;

import com.example.demo.entities.Tag;
import com.example.demo.repository.TagRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * In clasa TagService a fost implementata logica pentru adaugarea, preluarea, actualizarea
 * si stergerea tagurilor din baza de date. Clasa foloseste TagRepository pentru interactiunea
 * cu tabela Tag.
 */
@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    @Transactional
    public Tag addTag(Tag tag) {

        if (tag.getName() == null || tag.getName().isBlank() || tagRepository.findByName(tag.getName()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error adding tag");
        }

        return tagRepository.save(tag);
    }

    public Tag findById(Long id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tag not found for ID: " + id));
    }

    public List<Tag> findAll() {
        List<Tag> tags = tagRepository.findAll();
        if (tags.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No tags found!");
        }
        return tags;
    }

    @Transactional
    public Tag updateTag(Long id, Tag updatedTag) {
        Tag existingTag = tagRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tag not found for ID: " + id));

        if (updatedTag.getName() == null || updatedTag.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tag name cannot be null or empty");
        }

        existingTag.setName(updatedTag.getName());
        return tagRepository.save(existingTag);
    }

    public String deleteTag(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tag not found for ID: " + id));

        tagRepository.delete(tag);
        return "Tag with ID: " + id + " has been deleted!";
    }

    public Tag findByName(String name) {
        return tagRepository.findByName(name)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tag not found with name: " + name));
    }

}
