import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';

import { Foods } from '../../types';

import { FoodsContainer } from './styles';

export function Dashboard() {
	const [foods, setFoods] = useState<Foods[]>([]);
	const [editingFood, setEditingFood] = useState({} as Foods);
	const [modalOpen, setModalOpen] = useState(false);
	const [editModalOpen, setEditingModalOpen] = useState(false);

	useEffect(() => {
		async function loadFoods() {
			const response = await api.get('foods');

			setFoods(response.data);
		}

		loadFoods();
	}, []);

	async function handleAddFood(food: Foods) {
		const response = await api.post('foods', {
			...food,
			available: true,
		});

		const newFood = response.data;

		setFoods((state) => [...state, newFood]);
	}

	async function handleUpdateFood(editFood: Foods) {
		const response = await api.put(`foods/${editingFood.id}`,
			Object.assign(editingFood, { ...editFood }));

		const foodUpdated = response.data;

		const foodsFormatted = foods.map((food) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			(food.id === editFood.id) ?? { ...foodUpdated };

			return food;
		});

		setFoods(foodsFormatted);
	}

	async function handleDeleteFood(id: number) {
		await api.delete(`foods/${id}`);

		const foodsFiltered = foods.filter((food) => !(food.id === id));

		setFoods(foodsFiltered);
	}

	function toggleModal() {
		setModalOpen((state) => !state);
	}

	function toggleEditModal() {
		setEditingModalOpen((state) => !state);
	}

	function handleEditFood(food: Foods) {
		setEditingFood(food);
		setEditingModalOpen(true);
	}

	return (
		<>
			<Header openModal={toggleModal} />
			<ModalAddFood
				isOpen={modalOpen}
				setIsOpen={toggleModal}
				handleAddFood={handleAddFood}
			/>
			<ModalEditFood
				isOpen={editModalOpen}
				setIsOpen={toggleEditModal}
				editingFood={editingFood}
				handleUpdateFood={handleUpdateFood}
			/>

			<FoodsContainer data-testid="foods-list">
				{foods
					&& foods.map((food) => (
						<Food
							key={food.id}
							food={food}
							handleDelete={handleDeleteFood}
							handleEditFood={handleEditFood}
						/>
					))}
			</FoodsContainer>
		</>
	);
}
