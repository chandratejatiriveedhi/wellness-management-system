{mode === 'list' && renderSearchFilters2()}
{(mode === 'add' || mode === 'change' || mode === 'consult') && renderCustomerForm()}
{mode === 'list' && renderCustomerList()}
</div>
);
}