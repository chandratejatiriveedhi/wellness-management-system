{mode === 'list' && renderSearchFilters()}
      {(mode === 'add' || mode === 'change' || mode === 'consult') && renderUserForm()}
      {mode === 'list' && renderUserList()}
    </div>
  );
}